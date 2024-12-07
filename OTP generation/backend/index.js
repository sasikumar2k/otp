const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes')
const otpRoutes = require('./routes/otpRoutes')
require("dotenv").config();
const db = require("./db/db");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    console.error(err); // Log error details
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Erroe",
    });
    next();
});
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
