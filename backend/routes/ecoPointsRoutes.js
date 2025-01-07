const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Assuming you have a User model

const router = express.Router();

// POST /api/users/update-eco-points
router.post(
  '/update-eco-points',
  asyncHandler(async (req, res) => {
    const { userId, ecoPointsUsed } = req.body;

    if (!userId || ecoPointsUsed === undefined) {
      res.status(400);
      throw new Error('User ID and Eco Points Used are required');
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.ecoPoints < ecoPointsUsed) {
      res.status(400);
      throw new Error('Insufficient Eco Points');
    }

    // Deduct eco points
    user.ecoPoints -= ecoPointsUsed;

    // Save updated user data
    await user.save();

    res.status(200).json({ message: 'Eco Points updated successfully', ecoPoints: user.ecoPoints });
  })
);

module.exports = router;