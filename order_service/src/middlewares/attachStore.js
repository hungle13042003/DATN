
const attachStore = (req, res, next) => {
  const storeId = req.headers["x-store-id"];

  if (!storeId) {
    return res.status(400).json({
      message: "Missing x-store-id header",
    });
  }

  req.storeId = storeId; // ✅ STRING
  next();
};

export default attachStore;
