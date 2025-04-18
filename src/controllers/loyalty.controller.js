const User = require('../models/User');
const Reward = require('../models/Reward'); 

const calculateTier  = require('../utils/tierCalculator');


exports.addPoints = async (req, res) => {
  try {
    const { phone, type, amount } = req.body;

    const pointMap = {
      booking: amount * 100,
      spending: amount * 0.2,
      referral: 200
    };

    const points = pointMap[type];
    if (!points) return res.status(400).send({ message: "Invalid type" });

    const user = await User.findOne({phone: phone});
    if (!user) return res.status(404).send({ message: "User not found" });

    if (!user.loyalty) {
      user.loyalty = { points: 0, tier: 'Bronze', history: [] };
    }

    // Check if this is their first booking/spending to give 500 bonus points
    const hasPriorActivity = user.loyalty.history.some(
      entry => entry.type === 'booking' || entry.type === 'spending'
    );

    let totalPoints = points;

    if (!hasPriorActivity && (type === 'booking' || type === 'spending')) {
      totalPoints += 500;
    }

    user.loyalty.points += totalPoints;
    user.loyalty.tier = calculateTier(user.loyalty.points);

    user.loyalty.history.push({ type, points: totalPoints, date: new Date() });

    await user.save();

    res.send({
      message: `${totalPoints} points added.`,
      tier: user.loyalty.tier,
      history: user.loyalty.history
    });

  } catch (error) {
    console.log('Error adding points', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.redeemPoints = async (req, res) => {

  const userId = req.params.userId
  try {
    const { rewardId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.available) {
      return res.status(404).send({ message: "Reward not available" });
    }

    if (user.loyalty.points < reward.cost) {
      return res.status(400).send({ message: "Insufficient points" });
    }

    user.loyalty.points -= reward.cost;

    // Tier logic with 1-year protection
    const newTier = calculateTier(user.loyalty.points);
    const currentTier = user.loyalty.tier;
    const tierOrder = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const currentTierIndex = tierOrder.indexOf(currentTier);
    const newTierIndex = tierOrder.indexOf(newTier);

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    if (newTierIndex > currentTierIndex) {
      user.loyalty.tier = newTier;
      user.loyalty.tierAchievedDate = now;
    } else if (
      user.loyalty.tierAchievedDate &&
      user.loyalty.tierAchievedDate <= oneYearAgo &&
      newTierIndex !== currentTierIndex
    ) {
      // Allow downgrade only if held for >= 1 year
      user.loyalty.tier = newTier;
      user.loyalty.tierAchievedDate = now;
    }
    // else: tier remains the same (no change)

    user.loyalty.history.push({
      type: "redeem",
      points: -reward.cost,
      reward: reward.name,
      date: now
    });

    if (reward.quantity > 0) {
      reward.quantity -= 1;
      await reward.save();
    }

    await user.save();

    res.send({
      message: "Reward redeemed successfully",
      tier: user.loyalty.tier
    });

  } catch (error) {
    console.log('Error redeeming points', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getPoint = async (req, res) => {
  const userId = req.params.userId
  try {
    const user = await User.findById(userId);
    if (!user || !user.loyalty) {
      return res.status(404).json({ message: 'User or loyalty info not found' });
    }
    const points = user.loyalty.points || 0;
    res.status(200).json({points})
  } catch (error) {
    console.log('Error fetching points', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// exports.update

// exports.updatePoint = async (req, res) => {
//   try {
//     const { userId, points } = req.body;

//     const user = await User.findById(userId);
//     if (!user || !user.loyalty) {
//       return res.status(404).json({ message: 'User or loyalty info not found' });
//     }

//     // Update the points
//     user.loyalty.points = points;

//     // Optionally update tier again
//     user.loyalty.tier = calculateTier(points);

//     await user.save();

//     res.status(200).json({
//       message: 'Points updated successfully',
//       points: user.loyalty.points,
//       tier: user.loyalty.tier
//     });
//   } catch (error) {
//     console.log('Error updating points', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
