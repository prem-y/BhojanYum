const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 4000;
const otpGenerator = require("otp-generator");
const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

const foodSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String },
});
const Food = mongoose.model("Food", foodSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  otp: { type: Number },
  verified: { type: Boolean },
});
const User = mongoose.model("User", userSchema);

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiration: {
    type: Date,
    default: Date.now,
    get: (otpExpiration) => otpExpiration.getTime(),
    set: (otpExpiration) => new Date(otpExpiration),
  },
});
const OTP = mongoose.model("OTP", otpSchema);

//User

app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/users", async (req, res) => {
  const newUser = req.body;
  try {
    const createdUser = await User.create(newUser);
    console.log("User added:", createdUser);
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/find/:userEmail", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userEmail });
    if (user) {
      console.log(`User found: ${user.username}, Email=${user.email}`);
      res.status(200).json(user);
    } else {
      console.log(`User not found: ${req.params.userEmail}`);
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//foods
app.post("/foods", async (req, res) => {
  const newFood = req.body;
  try {
    const createdFood = await Food.create(newFood);
    console.log("Food added:", createdFood);
    res.status(201).json({ message: "Food added successfully" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/foods", async (req, res) => {
  try {
    const allFoods = await Food.find();
    res.json(allFoods);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/foods/:category", async (req, res) => {
  try {
    const category = req.params.category; // Extract category from URL
    const foods = await Food.find({ category }); // Find foods by category

    if (foods.length > 0) {
      res.status(200).json(foods); // Return foods if found
    } else {
      res.status(404).json({ message: "Foods not found" }); // No foods found for the category
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/food/:foodId", async (req, res) => {
  try {
    const food = await Food.findOne({ _id: req.params.foodId });
    if (food) {
      res.status(200).json(food);
    } else {
      res.status(404).json({ message: "Food not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//otp
app.post("/sendotp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const cDate = new Date();
    await OTP.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpiration: new Date(cDate.getTime()) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    // await twilioClient.messages.create({
    //   body: `From BhojanYum: Your OTP is: ${otp}`,
    //   to: phoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    // });
    return res.status(200).json({
      success: true,
      msg: otp,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
});

app.post("/verification", async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;
    const response = await OTP.findOne({ phoneNumber });
    console.log(response);

    if (response) {
      if (response.otp === otp) {
        return res.json({
          success: true,
          msg: "Verified",
        });
      } else {
        return res.json({
          success: false,
          msg: "Incorrect OTP",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        msg: "Phone number not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
});


//orders
const orderSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String },
  username: { type: String, required: true }, 
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

app.get("/orders", async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/orders", async (req, res) => {
  const newOrder = req.body;
  try {
    const createdOrder = await Order.create(newOrder);
    res.status(201).json({ message: "Order added successfully", order: createdOrder });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
