import Item from "../models/Item.js";
import { analyzeReview } from "../utils/analyzeReview.js";

// GET all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new item
export const addItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST review
export const addReview = async (req, res) => {
  try {
    const { rating, review, username } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Generate judgement
    const judgement = analyzeReview(review, rating);

    // Add review to Item
    item.reviews.push({
      username,
      rating,
      review,
      judgement
    });

    // Update average rating
    const total = item.reviews.reduce((sum, r) => sum + r.rating, 0);
    item.averageRating = total / item.reviews.length;

    await item.save();
    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { itemId, reviewId } = req.params;
    const { username } = req.user; // from JWT

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const review = item.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // enforce ownership
    if (review.username !== username) {
      return res.status(403).json({ error: "Not allowed" });
    }

    review.deleteOne();  // mongoose way to remove subdoc
    await item.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
