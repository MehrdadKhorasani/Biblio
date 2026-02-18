const Category = require("../models/category.model");

// ایجاد دسته‌بندی جدید
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCategoriesWithBookCount = async (req, res) => {
  try {
    const categories = await Category.findAllWithBookCount(false);
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ویرایش دسته‌بندی
const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updated = await Category.update(categoryId, { name, description });

    res.status(200).json({
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// تغییر وضعیت فعال/غیرفعال دسته‌بندی
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createCategory,
  getCategoriesWithBookCount,
  updateCategory,
  toggleCategory,
};
