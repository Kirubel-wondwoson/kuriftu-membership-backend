const User = require('../models/User')
const Reward = require('../models/Reward')


// exports.redeemPoints = async (req, res) => {
//   const { userId, rewardId } = req.body;

//   const user = await User.findById(userId);
//   const reward = await Reward.findById(rewardId);

//   if (!user || !reward) return res.status(404).send({ message: "User or reward not found" });
//   if (!reward.available) return res.status(400).send({ message: "Reward not available" });
//   if (user.loyalty.points < reward.cost) return res.status(400).send({ message: "Insufficient points" });

//   // Deduct points
//   user.loyalty.points -= reward.cost;
//   user.loyalty.tier = calculateTier(user.loyalty.points);

//   // Log history
//   user.loyalty.history.push({
//     type: "redeem",
//     points: -reward.cost,
//     reward: reward.name,
//     date: new Date()
//   });

//   // Optional: reduce quantity
//   if (reward.quantity !== undefined) {
//     reward.quantity -= 1;
//     if (reward.quantity <= 0) reward.available = false;
//     await reward.save();
//   }

//   await user.save();
//   res.send({ message: "Reward redeemed", tier: user.loyalty.tier });
// };


exports.createRewards = async (req, res) => {
  try {
    const {
      name, 
      description, 
      cost, 
      available, 
      quantity, 
      category
    } = req.body;

    if(!name, !cost, !available, !quantity, !category){
      res.status(400).json({message: 'Fill the required fields'})
    }

    const reward = Reward.create({
      name, 
      description, 
      cost, 
      available, 
      quantity, 
      category
    })
    res.status(201).json({message: "Rewards created successfully", Reward: reward})
  } catch (error) {
    console.log('Error creating rewards', error)
    res.status(500).json({message: 'Internal server error'})
  }
}

exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json({message: "Avaliable rewards", Reward: rewards})
  } catch (error) {
    console.log('Error getting rewards', error)
    res.status(500).json({message: 'Internal server error'})
  }
}