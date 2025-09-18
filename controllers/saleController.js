const PDFDocument = require("pdfkit");
const { Sale, SaleProduct, Product } = require("../models");
const fs = require("fs");
const path = require("path");

exports.generateSalePDF = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: SaleProduct,
          include: [Product],
        },
      ],
    });

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Crear el documento PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Nombre del archivo
    const fileName = `Sale_${sale.id}.pdf`;
    const filePath = path.join(__dirname, "../temp", fileName);

    // Crear carpeta temp si no existe
    if (!fs.existsSync(path.join(__dirname, "../temp"))) {
      fs.mkdirSync(path.join(__dirname, "../temp"));
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Cabecera
    doc.fontSize(20).text("Comprobante de Venta", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`ID de venta: ${sale.id}`);
    doc.text(`Cliente: ${sale.customer || "N/A"}`);
    doc.text(`Fecha: ${sale.createdAt.toLocaleString()}`);
    doc.moveDown();

    // Tabla de productos
    doc.fontSize(14).text("Productos:");
    doc.moveDown();

    sale.SaleProducts.forEach((item) => {
      doc
        .fontSize(12)
        .text(
          `${item.Product.name} - Cantidad: ${item.quantity} - Precio unitario: $${item.unitPrice} - Subtotal: $${item.quantity * item.unitPrice}`
        );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${sale.total}`, { align: "right" });

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, fileName, (err) => {
        if (err) console.error(err);
        // Opcional: borrar el archivo después de descargar
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

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

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la venta
    const sale = await Sale.findByPk(id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Eliminar los productos asociados (opcional si tu migración ya tiene ON DELETE CASCADE)
    await SaleProduct.destroy({ where: { saleId: id } });

    // Eliminar la venta
    await sale.destroy();

    res.json({ message: "Venta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ message: error.message });
  }
};
