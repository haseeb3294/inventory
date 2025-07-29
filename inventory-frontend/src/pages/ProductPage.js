import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Close } from "@mui/icons-material";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import { useAuth } from "../context/AuthContext";

const HARDCODED_CATEGORIES = [
  { _id: "1", name: "Electronics" },
  { _id: "2", name: "Clothing" },
  { _id: "3", name: "Furniture" },
  { _id: "4", name: "Books" },
  { _id: "5", name: "Other" },
];
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(HARDCODED_CATEGORIES);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
    fetchProducts();
    fetchCategories();
  }, [token, navigate]);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await productService.getProducts(filters);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (productData) => {
    try {
      await productService.createProduct(productData, token);
      await fetchProducts();
      setEditingProduct(null);
      setSuccess("Product created successfully!");
    } catch (err) {
      setError("Failed to create product");
      console.error(err);
    }
  };

  const handleUpdate = async (productData) => {
    try {
      await productService.updateProduct(
        editingProduct._id,
        productData,
        token
      );
      await fetchProducts();
      setEditingProduct(null);
      setSuccess("Product updated successfully!");
    } catch (err) {
      setError("Failed to update product");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id, token);
      await fetchProducts();
      setSuccess("Product deleted successfully!");
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Products Management
              {token && !editingProduct && (
                <IconButton
                  color="primary"
                  onClick={() => setEditingProduct({})}
                  aria-label="add product"
                >
                  <Add fontSize="large" />
                </IconButton>
              )}
            </Typography>

            {loading && (
              <Grid container justifyContent="center" sx={{ my: 4 }}>
                <CircularProgress />
              </Grid>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {editingProduct ? (
              <ProductForm
                onSubmit={editingProduct._id ? handleUpdate : handleCreate}
                initialData={editingProduct}
                categories={categories}
                onCancel={() => setEditingProduct(null)}
              />
            ) : null}

            {!loading && (
              <ProductList
                products={products}
                categories={categories}
                onEdit={setEditingProduct}
                onDelete={handleDelete}
                onFilter={fetchProducts}
                token={token}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPage;
