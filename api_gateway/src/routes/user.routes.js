import express from "express";
import axios from "axios";

const router = express.Router();
const URL = process.env.USER_SERVICE_URL;

router.use(async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${URL}${req.originalUrl.replace("/api/users", "")}`,
      data: req.body,
      headers: req.headers
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(
      err.response?.data || { message: "User service error" }
    );
  }
});

export default router;
