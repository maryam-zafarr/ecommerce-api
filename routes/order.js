const router = require("express").Router();
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Order = require("../models/Order");

// CREATE ORDER
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// EDIT ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Successfully deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET USER ORDERS
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET MONTHLY INCOME
router.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ORDER COUNT
router.get("/count", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders.length);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CUSTOMER COUNT
router.get("/customers", async (req, res) => {
  try {
    const orders = await Order.find();
    const customers = [...new Set(orders.map((order) => order.userId))];
    res.status(200).json(customers.length);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
