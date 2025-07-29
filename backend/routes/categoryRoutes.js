const express = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCategory);
router.get("/", getCategories);

module.exports = router;
