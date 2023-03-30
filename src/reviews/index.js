import express from "express";
import createHttpError from "http-errors";
import UsersModel from "../users/model.js";
import ReviewsModel from "./model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewsModel.create({
      ...req.body,
      productId: req.params.productId,
    });
    res.status(201).send({ reviewId });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.findAll({
      where: { productId: req.params.productId },
      include: [{ model: UsersModel, attributes: ["firstName", "lastName"] }],
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
