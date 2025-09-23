const Category = require('../Model/category.model');

// Function to create a new category
const createCategory = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the request body

        // Check for the presence of the `name` property
        if (!req.body || !req.body.name) {
            console.log('Name field is missing in the request body');
            return res.status(400).send('Name is required.');
        }

        const { name, description } = req.body;

        const existingCategory = await Category.findOne({ categoryName: name });
        if (existingCategory) {
            return res.status(400).send('Category with the same name already exists.');
        }

        const newCategory = new Category({
            categoryName: name, // Assuming you want to use "categoryName" in the database
            description
        });

        await newCategory.save();
        res.status(201).send('Category created successfully.');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Internal server error.');
    }
};


// Function to retrieve all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories from MongoDB
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).send('Internal server error.');
    }
};

// Function to retrieve a specific category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id); // Fetch the category by its ID
        if (!category) {
            return res.status(404).send('Category not found.');
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error retrieving category:', error);
        res.status(500).send('Internal server error.');
    }
};

// Function to update a category by ID
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        res.status(200).send('Category updated successfully.');
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send('Internal server error.');
    }
};

// Function to delete a category by ID
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        res.status(200).send('Category deleted successfully.');
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).send('Internal server error.');
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};