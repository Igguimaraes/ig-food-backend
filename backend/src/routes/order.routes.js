/**
 * ROTAS DE PEDIDOS
 * Prefixo definido em app.js → /orders
 */

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");
const adminMiddleware = require("../middlewares/admin.middleware");

/**
 * POST /orders
 * Cria um novo pedido (usuário autenticado)
 */
router.post("/", authMiddleware, orderController.createOrder);

// Listar pedidos do usuário logado
router.get("/my", authMiddleware, orderController.listMyOrders);

/**
 * GET /orders/:id
 * Busca pedido pelo ID (usuário autenticado)
 */
router.get("/:id", authMiddleware, orderController.getOrderById);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);
/**
 * PATCH /orders/:id/status
 * Atualiza status do pedido (regra de negócio validada no controller)
 */
router.patch("/:id/status", authMiddleware, orderController.updateOrderStatus);

module.exports = router;
