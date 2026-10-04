import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },

        itemName: {
            type: String,
            required: true,
        },

        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },

        selectedOption: [
            {
                choiceName: String,
                selectedName: String,
                optionPrice: Number
            }
        ],
        optionPrice: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },

        orderItems: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items && items.length > 0;
                },
                message: "At least one order item is required",
            },
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        name: {
            type: String,
        },
        address: {
            type: String
        },
        note: { type: String },
        orderId: {
            type: String,
            required: true,
            unique: true,
            length: 6,
        },
    },
    {
        timestamps: true,
    }
);

// Generate 6-digit order ID
orderSchema.pre("validate", async function (next) {
    if (!this.orderId) {
        let orderId;
        let exists = true;

        while (exists) {
            orderId = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            exists = await mongoose.models.Order.exists({
                orderId,
            });
        }

        this.orderId = orderId;
    }

    next();
});

export default mongoose.model("Order", orderSchema);