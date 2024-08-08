import Listing from "../models/Listing.model.js";

export const Create = async (req, res, next) => {
  try {
    const list = await Listing.create(req.body);

    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
