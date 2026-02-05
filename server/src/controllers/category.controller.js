const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updated = await Category.toggleActive(categoryId, !category.isActive);

    res.status(200).json({
      message: "Category status updated",
      category: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  toggleCategory,
};
