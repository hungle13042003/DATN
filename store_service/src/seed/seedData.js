import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Store from "../models/Store.js";

dotenv.config();

const stores = [
  {
    code: "HN001",
    name: "Cửa hàng Hà Nội - Cầu Giấy",
    address: "Số 1 Trần Duy Hưng, Cầu Giấy, Hà Nội",
    phone: "0901000001",
  },
  {
    code: "HN002",
    name: "Cửa hàng Hà Nội - Hà Đông",
    address: "Số 99 Quang Trung, Hà Đông, Hà Nội",
    phone: "0901000002",
  },
];

const seedStoreData = async () => {
  try {
    await connectDB();

    // Xóa toàn bộ store cũ
    await Store.deleteMany();

    // Thêm store mới
    await Store.insertMany(stores);

    console.log("✅ Seed store data thành công (2 cửa hàng Hà Nội)");
    process.exit();
  } catch (error) {
    console.error("❌ Seed store data thất bại:", error.message);
    process.exit(1);
  }
};

seedStoreData();
