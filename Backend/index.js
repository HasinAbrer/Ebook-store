require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());

const whitelist = [
  'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:4173', // egula cors  er whitelist
  'http://127.0.0.1:4173',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  credentials: true,
}));

app.options('*', cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve images directly from src/images so developers can drop files there
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));

//routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const AdminRoute = require("./src/stats/admin.stats");
const profileRoutes = require("./src/users/profile.route");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");
const newsRoutes = require("./src/news/news.route");
const reviewRoutes = require("./src/reviews/review.route");
const messageRoutes = require("./src/messages/message.route");
const uploadRoutes = require("./src/uploads/upload.route");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", AdminRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);

// Test route hisebe use korbo
app.get("/", (req, res) => {
  res.json({ message: "Book Store Server is running!" });
});

// Error Handling middleware er jonnne
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
