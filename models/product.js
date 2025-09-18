'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsToMany(models.Sale, {
        through: models.SaleProduct,
        foreignKey: "productId",
        otherKey: "saleId"
      });
    }
  }
  Product.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    unitPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};