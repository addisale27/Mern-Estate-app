import Listing from "../models/Listing.model.js";
import { errorHandler } from "../utils/error.js";

export const Create = async (req, res, next) => {
  try {
    const list = await Listing.create(req.body);

    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "listing not found!"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only delete your own listings!"));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing deleted successfully!");
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!req.user || req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own account!"));
  }
  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json("Updated successfully!");
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(401, "listing not found!"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
