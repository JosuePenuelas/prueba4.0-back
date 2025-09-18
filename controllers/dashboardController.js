const { Sale, SaleProduct, Product } = require("../models");
const { Sequelize } = require("sequelize");

exports.getDashboard = async (req, res) => {
  try {
    // Total de ventas
    const totalSales = await Sale.count();

    // Monto total de ingresos
    const totalRevenueData = await Sale.sum("total");
    const totalRevenue = totalRevenueData || 0;

    // Producto más vendido (sumando la cantidad vendida)
    const topProductData = await SaleProduct.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"]
      ],
      group: ["productId"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      limit: 1,
      include: [{ model: Product, attributes: ["name"] }]
    });

    const topProduct = topProductData.length > 0
      ? {
          name: topProductData[0].Product.name,
          quantity: topProductData[0].dataValues.totalSold
        }
      : { name: null, quantity: 0 };

    res.json({ totalSales, totalRevenue, topProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};
