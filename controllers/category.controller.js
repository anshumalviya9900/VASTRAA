import Category from "../model/category.model.js";

export const createCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const existing = await Category.findOne({ categoryName });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ categoryName });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const updated = await Category.findByIdAndUpdate(id, { categoryName }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated", category: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};