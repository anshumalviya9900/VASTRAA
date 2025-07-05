import Wishlist from "../model/wishlist.model.js";
import Product from "../model/product.model.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user._id,
        products: [product._id],
      });
    } else {
      if (!wishlist.products.includes(product._id)) {
        wishlist.products.push(product._id);
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserWishlist = async (req, res) => {
  const userId = req.user._id;
  const wishlist = await Wishlist.findOne({ userId }).populate("products");
  res.json({ wishlist });
};


export const removeFromWishlist = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  res.json({ message: "Removed from wishlist" });
};
