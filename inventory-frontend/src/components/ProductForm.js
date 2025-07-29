import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

const ProductForm = ({ onSubmit, initialData, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    inStock: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price ? initialData.price.toString() : "",
        categoryId:
          initialData.categoryId?._id ||
          initialData.categoryId ||
          categories[0]._id,
        inStock: initialData.inStock ?? true,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0]._id,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for price field
    if (name === "price") {
      // Only allow numbers and decimal point
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const validatePrice = (price) => {
    if (price === "") {
      setPriceError("Price is required");
      return false;
    }
    if (parseFloat(price) <= 0) {
      setPriceError("Price must be greater than 0");
      return false;
    }
    setPriceError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!validatePrice(formData.price)) {
      return;
    }

    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price), // Convert to number before submission
      });
    } catch (err) {
      setError(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(initialData && initialData._id);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        p: 3,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {isEditing ? "Edit Product" : "Create New Product"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            error={!formData.name.trim()}
            helperText={!formData.name.trim() ? "Product name is required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            variant="outlined"
            error={!!priceError}
            helperText={priceError}
            InputProps={{
              startAdornment: "$",
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            variant="outlined"
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                color="primary"
              />
            }
            label="In Stock"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
