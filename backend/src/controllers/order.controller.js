/**
 * CONTROLLER DE PEDIDOS
 * Responsável por:
 *  - criar pedidos
 *  - buscar pedido por id
 *  - atualizar status
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * CRIAR PEDIDO VINCULADO AO USUÁRIO
 * POST /orders
 */
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body || {};
    const userId = req.userId;

    // Validação dos itens
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "O pedido precisa conter itens",
      });
    }

    // Verifica se o usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(400).json({
        message: "Usuário não encontrado",
      });
    }

    // Busca os produtos
    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "Um ou mais produtos não existem",
      });
    }

    // Calcula total e monta itens do pedido
    let total = 0;

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      total += product.price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Cria o pedido
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          // 🔒 ajuste de segurança (sem mudar lógica)
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("ERRO CREATE ORDER:", error);
    return res.status(500).json({
      message: "Erro ao criar pedido",
    });
  }
};

/**
 * LISTAR PEDIDOS DO USUÁRIO LOGADO
 * GET /orders/my
 */
exports.listMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error("ERRO LIST MY ORDERS:", error);
    return res.status(500).json({
      message: "Erro ao listar pedidos",
    });
  }
};

/**
 * BUSCAR PEDIDO PELO ID
 * GET /orders/:id
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("ERRO GET ORDER:", error);
    return res.status(500).json({
      message: "Erro ao buscar pedido",
      details: error.message,
    });
  }
};

/**
 * ATUALIZAR STATUS DO PEDIDO (ADMIN)
 * PATCH /orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body || {};

    if (!newStatus) {
      return res.status(400).json({
        message: "Status é obrigatório",
      });
    }

    // 1) Busca pedido atual
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      select: { id: true, status: true },
    });

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado",
      });
    }

    const currentStatus = order.status;

    // 2) Mapa de transições permitidas
    const allowedTransitions = {
      RECEBIDO: ["PREPARANDO", "CANCELADO"],
      PREPARANDO: ["PRONTO", "CANCELADO"],
      PRONTO: ["ENTREGUE"],
      ENTREGUE: [],
      CANCELADO: [],
    };

    const allowedNextStatus = allowedTransitions[currentStatus] || [];

    // 3) Valida transição
    if (!allowedNextStatus.includes(newStatus)) {
      return res.status(400).json({
        message: "Transição de status inválida",
        currentStatus,
        attemptedStatus: newStatus,
        allowedNextStatus,
      });
    }

    // 4) Atualiza
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: newStatus },
      include: {
        items: {
          include: { product: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json(updatedOrder);
  } catch (error) {
    console.error("ERRO UPDATE ORDER STATUS:", error);

    return res.status(500).json({
      message: "Erro ao atualizar status",
      details: error.message,
    });
  }
};
