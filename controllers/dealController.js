const Deal = require('../models/dealModel');

// POST: Create new deal
exports.createDeal = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageBase64,
      dealEndTime,
      isDealOfTheDay
    } = req.body;

    // Automatically set today's 11:59 PM if dealEndTime not provided
    let endTime;
    if (dealEndTime) {
      endTime = new Date(dealEndTime);
    } else {
      const now = new Date();
      now.setHours(23, 59, 0, 0); // Local time 11:59 PM
      endTime = now;
    }

    const newDeal = new Deal({
      name,
      description,
      price,
      imageBase64,
      isDealOfTheDay: isDealOfTheDay || false,
      dealEndTime: endTime
    });

    const savedDeal = await newDeal.save();
    res.status(201).json({ message: "Deal created", deal: savedDeal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET: Get current deal of the day
exports.getDealOfTheDay = async (req, res) => {
  try {
    const deal = await Deal.findOne({ isDealOfTheDay: true });

    if (!deal) {
      return res.status(404).json({ message: 'No Deal of the Day found' });
    }

    res.json(deal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
