import Order from "../models/orderModel.js";
import Item from "../models/itemModel.js";

// =======================
// CREATE ORDER
// =======================

export const createOrder = async (req, res) => {
    try {
        const { orderItems } = req.body;
        console.log(req.body)
        console.log("Received order items:", orderItems);

        // =========================
        // VALIDATE ORDER ITEMS
        // =========================
        if (
            !orderItems ||
            !Array.isArray(orderItems) ||
            orderItems.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Order items are required",
            });
        }

        const finalOrderItems = [];
        let totalPrice = 0;

        // =========================
        // PROCESS EACH ITEM
        // =========================
        for (const orderItem of orderItems) {
            const {
                itemId,
                selectedOption,
                qty = 1,
            } = orderItem;

            // Validate item ID
            if (!itemId) {
                return res.status(400).json({
                    success: false,
                    message: "Item ID is required",
                });
            }

            // Validate quantity
            const quantity = Number(qty);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be a positive integer",
                });
            }

            // =========================
            // FIND ITEM
            // =========================
            const item = await Item.findById(itemId);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: `Item not found: ${itemId}`,
                });
            }

            // =========================
            // BASE PRICE
            // =========================
            const basePrice = Number(item.price || 0);

            let optionPrice = 0;
            let finalSelectedOption = null;


            // =========================
            // PROCESS SELECTED OPTIONS
            // =========================
            if (selectedOption) {

                /*
                    Incoming format:
            
                    "Choose Raita: 250 ml, Choose Boti: Leg Piece"
                */

                const selectedOptions = selectedOption
                    .split(",")
                    .map((option) => option.trim())
                    .filter(Boolean);

                const normalizedOptions = [];

                optionPrice = 0;

                for (const selected of selectedOptions) {

                    const separatorIndex = selected.indexOf(":");

                    if (separatorIndex === -1) {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid selected option format for ${item.name}`,
                        });
                    }

                    const choiceName = selected
                        .substring(0, separatorIndex)
                        .trim();

                    const selectedName = selected
                        .substring(separatorIndex + 1)
                        .trim();

                    // =========================
                    // FIND OPTION GROUP
                    // =========================
                    const optionGroup = (item.itemOptions || []).find(
                        (group) =>
                            group.name?.toLowerCase() ===
                            choiceName.toLowerCase()
                    );

                    if (!optionGroup) {
                        return res.status(400).json({
                            success: false,
                            message: `Option group "${choiceName}" not found for ${item.name}`,
                        });
                    }

                    // =========================
                    // FIND OPTION
                    // =========================
                    const option = (optionGroup.option || []).find(
                        (opt) =>
                            opt.name?.toLowerCase() ===
                            selectedName.toLowerCase()
                    );

                    if (!option) {
                        return res.status(400).json({
                            success: false,
                            message: `Option "${selectedName}" not found in "${choiceName}" for ${item.name}`,
                        });
                    }

                    // =========================
                    // GET PRICE FROM DATABASE
                    // =========================
                    const currentOptionPrice = Number(option.price || 0);

                    optionPrice += currentOptionPrice;

                    // =========================
                    // STORE AS OBJECT
                    // =========================
                    normalizedOptions.push({
                        choiceName: optionGroup.name,
                        selectedName: option.name,
                        optionPrice: currentOptionPrice,
                    });
                }

                // =========================
                // FINAL SELECTED OPTIONS
                // =========================
                finalSelectedOption = normalizedOptions;
            }

            // =========================
            // PRICE CALCULATION
            // =========================
            const unitPrice = basePrice + optionPrice;

            const itemTotal =
                unitPrice * quantity;

            // =========================
            // ADD TO FINAL ORDER
            // =========================
            finalOrderItems.push({
                itemId: item._id,

                itemName: item.name,

                basePrice,

                selectedOption:
                    finalSelectedOption,

                optionPrice,

                totalPrice: itemTotal,
            });

            // Add to overall total
            totalPrice += itemTotal;
        }

        // =========================
        // CREATE ORDER
        // =========================
        console.log(req.body.generalInfo.name, req.body.generalInfo.note, req.body.generalInfo.address)
        const order = await Order.create({
            name: req.body.generalInfo.name,
            note: req.body.generalInfo.note,
            address: req.body.generalInfo.address,
            orderItems: finalOrderItems,
            totalPrice,
        });

        // =========================
        // RESPONSE
        // =========================
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });

    } catch (error) {
        console.error(
            "Create order error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


// =======================
// GET ORDERS
// =======================
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "orderItems.itemId",
                populate: {
                    path: "categoryId"
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};