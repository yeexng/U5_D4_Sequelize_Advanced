import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductsModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  //   productId: {
  //     type: DataTypes.INTEGER,
  //     primaryKey: true,
  //     autoIncrement: true,
  // },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(),
    allowNull: true,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default ProductsModel;
