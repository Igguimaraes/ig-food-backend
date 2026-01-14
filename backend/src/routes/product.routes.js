/**
 * ROTAS DE PRODUTOS
 * Prefixo: /products (definido em app.js)
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// GET /products
router.get("/", productController.listProducts);

// GET /products/:id
router.get("/:id", productController.getProductById);

// POST /products
router.post("/", productController.createProduct);

// PUT /products/:id
router.put("/:id", productController.updateProduct);

// DELETE /products/:id
router.delete("/:id", productController.deleteProduct);

module.exports = router;
