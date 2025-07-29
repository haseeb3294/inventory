# Product Inventory Management App

## Setup Instructions

### Backend

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```

Create .env file:
env

MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_secret_key

Start server:
bash

npm start

### Frontend

Install dependencies:
bash

cd inventory-frontend && npm install
Start app:
bash

npm start

### API Endpoints

Authentication

    POST /auth/signup
    Register new user (name, email, password)

    POST /auth/login
    Login user (email, password) → returns JWT

Products (Protected routes need JWT)

    GET /products
    Get all products (filter with: name, categoryId, inStock)

    POST /products
    Create product (name, price, categoryId, inStock)

    PUT /products/:id
    Update product

    DELETE /products/:id
    Delete product

Categories

    GET /categories
    Get all categories

    POST /categories (Protected)
    Create category (name)
