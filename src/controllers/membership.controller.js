exports.purchaseMembership = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Membership cost (can also come from DB/config)
    const requiredAmount = 999; // Example: 999 ETB for 1 year

    if (amount < requiredAmount) {
      return res.status(400).json({ message: `Membership requires at least ${requiredAmount} ETB.` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1);

    user.membership = {
      isActive: true,
      startDate: now,
      expiryDate: oneYearLater,
      amountPaid: amount
    };

    await user.save();

    res.status(200).json({ 
      message: "Membership activated for 1 year.",
      membership: user.membership
    });
  } catch (error) {
    console.error("Error purchasing membership", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
