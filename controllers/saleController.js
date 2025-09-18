const { Sale, SaleProduct, Product } = require("../models");

// Create new sale
exports.createSale = async (req, res) => {
  try {
    const { customer, products } = req.body; 
    // products = [{ productId, quantity }, ...]

    // Create sale header
    let total = 0;
    const sale = await Sale.create({ customer, total: 0 });

    // Add products
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product) continue;

      const unitPrice = product.unitPrice;
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      await SaleProduct.create({
        saleId: sale.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice
      });
    }

    // Update total
    await sale.update({ total });

    res.status(201).json({ sale, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sales with details
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: SaleProduct,
          include: [Product]
        }
      ]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single sale
exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: SaleProduct,
          include: [Product]
        }
      ]
    });
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
