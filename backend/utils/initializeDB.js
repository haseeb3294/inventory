// utils/initializeDB.js
const Category = require("../models/Category");

const HARDCODED_CATEGORIES = [
  { _id: "1", name: "Electronics" },
  { _id: "2", name: "Clothing" },
  { _id: "3", name: "Furniture" },
  { _id: "4", name: "Books" },
  { _id: "5", name: "Other" },
];

const initializeCategories = async () => {
  try {
    // Check if categories already exist
    const count = await Category.countDocuments();
    if (count === 0) {
      // Insert hardcoded categories
      await Category.insertMany(HARDCODED_CATEGORIES);
      console.log("Hardcoded categories added to database");
    }
  } catch (err) {
    console.error("Error initializing categories:", err);
  }
};

module.exports = initializeCategories;
