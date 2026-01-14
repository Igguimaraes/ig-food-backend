/**
 * CONTROLLER DE PRODUTOS
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * LISTAR PRODUTOS
 * GET /products
 */
exports.listProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar produtos",
      details: error.message,
    });
  }
};

/**
 * BUSCAR PRODUTO POR ID
 * GET /products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar produto",
      details: error.message,
    });
  }
};

/**
 * CRIAR PRODUTO
 * POST /products
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body || {};

    if (!name || price == null) {
      return res.status(400).json({
        message: "Nome e preço são obrigatórios",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar produto",
      details: error.message,
    });
  }
};

/**
 * ATUALIZAR PRODUTO
 * PUT /products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body || {};

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price: price != null ? Number(price) : undefined,
      },
    });

    return res.json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar produto",
      details: error.message,
    });
  }
};

/**
 * REMOVER PRODUTO
 * DELETE /products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover produto",
      details: error.message,
    });
  }
};
