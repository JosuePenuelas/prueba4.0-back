'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.belongsToMany(models.Product, {
        through: models.SaleProduct,
        foreignKey: "saleId",
        otherKey: "productId"
      });
      Sale.hasMany(models.SaleProduct, { foreignKey: "saleId" });
    }
  }
  Sale.init({
    customer: DataTypes.STRING,
    total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};