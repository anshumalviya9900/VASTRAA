import Dress from "../model/dress.model.js";

export const donateDress = async (req, res) => {
  try {
    const userId = req.user?._id;

    const { name, description } = req.body;
    const imagePaths = req.files.map((file) => file.filename);

    const newDress = new Dress({
      name,
      description,
      image: imagePaths,
      userId,
      type: "donation",
      isApproved: false,
    });

    await newDress.save();
    res.status(201).json({ message: "Dress donated. Pending admin approval.", dress: newDress });

  } catch (error) {
    console.error("Donate Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getUserDonations = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const donations = await Dress.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ donations });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const getAllDonation = async (req, res) => {
  try {
    const donations = await Dress.find({ isApproved: true });
    res.status(200).json({ donations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};