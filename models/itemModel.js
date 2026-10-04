import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    picture: {
      type: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    price: {
      type: Number,
    },

    itemOptions: [
      {
        name: {
          type: String,
          required: true,
        },

        option: [
          {
            name: {
              type: String,
              required: true,
            },

            price: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);