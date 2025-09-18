'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SaleProduct extends Model {
    static associate(models) {
      SaleProduct.belongsTo(models.Sale, { foreignKey: "saleId" });
      SaleProduct.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  SaleProduct.init({
    saleId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'SaleProduct',
  });
  return SaleProduct;
};