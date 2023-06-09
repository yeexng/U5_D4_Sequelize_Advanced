import { DataTypes } from "sequelize";
import CategoriesModel from "../categories/model.js";
import sequelize from "../db.js";
import ReviewsModel from "../reviews/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";

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

// 1 to many relationship
ProductsModel.hasMany(ReviewsModel, {
  foreignKey: { name: "productId", allowNull: true },
});

ReviewsModel.belongsTo(ProductsModel, {
  foreignKey: { name: "productId", allowNull: true },
});

// Many to many
ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default ProductsModel;
