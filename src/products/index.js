import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoriesModel from "../categories/model.js";
import ReviewsModel from "../reviews/model.js";
import UsersModel from "../users/model.js";
import ProductsModel from "./model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductsModel.create(req.body);
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((c) => {
          return { productId: productId, categoryId: category };
        })
      );
    }
    res.status(201).send({ productId });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    //filter
    const query = {};
    if (req.query.minPrice && req.query.maxPrice)
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    if (req.query.search) {
      query[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const products = await ProductsModel.findAndCountAll({
      attributes: ["name", "price", "description", "productId"],
      include: [
        {
          model: ReviewsModel,
          include: [
            { model: UsersModel, attributes: ["firstName", "lastName"] },
          ],
          attributes: ["content"],
        },
        {
          model: CategoriesModel,
          attributes: ["categoryName"],
          through: { attributes: [] },
        },
        // to exclude from the results the junction table rows --> through: { attributes: [] }
      ],
      where: { ...query },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [
        req.query.columnName && req.query.sortDirection
          ? [req.query.columnName, req.query.sortDirection]
          : ["name", "ASC"],
      ],
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      attributes: { exclude: [] }, // attributes is used to include and exclude columns that wanted
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { productId: req.params.productId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { productId: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/:productId/categories", async (req, res, next) => {
  try {
    const { id } = await ProductsCategoriesModel.create({
      productId: req.params.productId,
      categoryId: req.body.categoryId,
    });
    res.send({ id });
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
