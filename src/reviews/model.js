import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // <-- This automagically generates a unique string every time we insert a new record
  },
  content: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
});

UsersModel.hasMany(ReviewsModel, {
  foreignKey: { name: "userId", allowNull: true },
});
ReviewsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: true },
});
export default ReviewsModel;
