module.exports = (req, res, next) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado: apenas ADMIN",
    });
  }

  return next();
};
