const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true,
}));


const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

require("dotenv").config();

//middlewares
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}
));

//routes
const bookRoutes = require("./src/books/book.route");
app.use("/api/books", bookRoutes);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  app.use("/", (req, res) => {
   res.json({ message: "Book Store Server is running!" });
  });
}

main()
  .then(() => console.log("Mongodb connect successfully!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
