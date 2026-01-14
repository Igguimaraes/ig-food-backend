const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * CRIAR USUÁRIO
 * POST /users
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e senha são obrigatórios",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // sem hash por enquanto
      },
    });

    const { password: _, ...safeUser } = user;
    return res.status(201).json(safeUser);
  } catch (error) {
    console.error("ERRO CREATE USER:", error);
    return res.status(500).json({
      message: "Erro ao criar usuário",
    });
  }
};

/**
 * LISTAR USUÁRIOS
 * GET /users
 */
exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, // corrigido
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("ERRO LIST USERS:", error);
    return res.status(500).json({
      message: "Erro ao listar usuários",
    });
  }
};
