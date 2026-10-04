import Item from "../models/itemModel.js";

// =======================
// ADD ITEM
// =======================
export const addItem = async (req, res) => {
    try {
        const {
            name,
            description,
            picture,
            categoryId,
            price,
            itemOptions
        } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Item name is required"
            });
        }

        // Create item
        const item = await Item.create({
            name: name.trim(),
            description,
            picture,
            categoryId,
            price,
            itemOptions: itemOptions || []
        });

        return res.status(201).json({
            success: true,
            message: "Item added successfully",
            item
        });

    } catch (error) {
        console.error("Add item error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =======================
// EDIT ITEM
// =======================
export const editItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            picture,
            categoryId,
            price,
            itemOptions
        } = req.body;

        // Find item
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Update only provided fields
        if (name !== undefined) {
            item.name = name.trim();
        }

        if (description !== undefined) {
            item.description = description;
        }

        if (picture !== undefined) {
            item.picture = picture;
        }

        if (categoryId !== undefined) {
            item.categoryId = categoryId;
        }

        if (price !== undefined) {
            item.price = price;
        }

        if (itemOptions !== undefined) {
            item.itemOptions = itemOptions;
        }

        await item.save();

        return res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item
        });

    } catch (error) {
        console.error("Edit item error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =======================
// GET ITEMS
// =======================
export const getItems = async (req, res) => {
    try {
        const { categoryId } = req.query;

        let filter = {};

        // Optional category filter
        if (categoryId) {
            filter.categoryId = categoryId;
        }

        const items = await Item.find(filter)
            .populate("categoryId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        console.error("Get items error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =======================
// DELETE ITEM
// =======================
export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete item
        const item = await Item.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            item
        });

    } catch (error) {
        console.error("Delete item error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};