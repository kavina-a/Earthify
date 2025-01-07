const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

const createCategory = asyncHandler(async (req, res) => {
    try {

        const { name } = req.body;

        if (!name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const exisitingCategory = await Category.findOne({ name });

        if (exisitingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await new Category({name}).save();
        res.status(201).json(category);

    } catch(error) {
        console.log(error);
        res.status(400).json({ message: 'Error creating category', error: error.message });
    };
});

const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        res.status(200).json(category);
    } catch (error) {
        console.error("Error getting category by ID:", error);
        res.status(400).json({ message: 'Error getting category', error: error.message });
    }
});


const updateCategory = asyncHandler(async (req, res) => {

    try {

        const { name } = req.body;
        const { categoryId } = req.params;
        console.log(categoryId);
        

        const category = await Category.findOne({_id: categoryId});
        console.log(category);
        

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = name || category.name;

        await category.save();

        res.status(200).json(category);


    }catch(error) {
        console.log(error);
        res.status(400).json({ message: 'Error updating category', error: error.message });
    }

});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(400).json({ message: 'Error deleting category', error: error.message });
    }
});

const getCategories = asyncHandler( async(req,res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    }catch(error) {
        console.log(error);
        res.status(400).json({ message: 'Error getting categories', error: error.message });
    }
});



module.exports = { createCategory, updateCategory, deleteCategory, getCategories, getCategoryById };
