import Category from "../models/categoryModel.js";

// =======================
// CREATE CATEGORY
// =======================
export const createCategory = async (req, res) => {
    try {
        const { name, position } = req.body;

        // Validate required fields
        if (!name || position === undefined) {
            return res.status(400).json({
                success: false,
                message: "Name and position are required"
            });
        }

        // Create category
        const category = await Category.create({
            name: name.trim(),
            position
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =======================
// GET CATEGORIES
// =======================
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ position: 1 });

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =======================
// EDIT CATEGORY
// =======================
export const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position } = req.body;

        // Find category
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Update provided fields
        if (name !== undefined) {
            category.name = name.trim();
        }

        if (position !== undefined) {
            category.position = position;
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Edit category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =======================
// DELETE CATEGORY
// =======================
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete category
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};