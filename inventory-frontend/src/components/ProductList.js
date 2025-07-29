import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ProductList = ({
  products,
  categories,
  onEdit,
  onDelete,
  onFilter,
  token,
}) => {
  const [filters, setFilters] = useState({
    name: "",
    categoryId: "",
    inStock: false,
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      categoryId: "",
      inStock: false,
    });
    onFilter({});
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search by name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <TextField
          select
          label="Filter by category"
          name="categoryId"
          value={filters.categoryId}
          onChange={handleFilterChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              name="inStock"
              checked={filters.inStock}
              onChange={handleFilterChange}
            />
          }
          label="In Stock Only"
        />
        <Button variant="contained" onClick={applyFilters}>
          Apply
        </Button>
        <Button variant="outlined" onClick={clearFilters}>
          Clear
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>In Stock</TableCell>
              {token && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  {
                    categories.find((item) => item._id === product.category)
                      ?.name
                  }
                </TableCell>
                <TableCell>{product.inStock ? "Yes" : "No"}</TableCell>
                {token && (
                  <TableCell>
                    <Button onClick={() => onEdit(product)}>
                      <Edit />
                    </Button>
                    <Button onClick={() => onDelete(product._id)}>
                      <Delete />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
