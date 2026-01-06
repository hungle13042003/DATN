import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

/* ================= CATEGORY DATA ================= */
const categories = [
  { name: "Áo Hoodie", description: "Các loại áo hoodie nam nữ" },
  { name: "Áo Sweater", description: "Áo sweater thời trang" },
  { name: "Áo Thun", description: "Áo thun basic, oversize" },
  { name: "Áo Dài", description: "Áo dài truyền thống" },
  { name: "Áo Sơ Mi", description: "Áo sơ mi nam nữ" },
  { name: "Áo Khoác", description: "Áo khoác thời trang" },

  { name: "Quần Âu", description: "Quần âu nam nữ" },
  { name: "Quần Jean", description: "Quần jean thời trang" },
  { name: "Quần Thể Thao", description: "Quần thể thao năng động" },

  { name: "Đồng Hồ Nam", description: "Đồng hồ dành cho nam" },
  { name: "Đồng Hồ Nữ", description: "Đồng hồ dành cho nữ" },

//   { name: "Giày Nam", description: "Giày dành cho nam" },
//   { name: "Giày Nữ", description: "Giày dành cho nữ" },
  { name: "Giày Thể Thao", description: "Giày thể thao" },
];

/* ================= PRODUCT DATA ================= */
/*
  images: chỉ lưu ĐƯỜNG DẪN
  VD: /uploads/products/hoodie1.jpg
*/
const products = [
  {
    name: "Áo Hoodie Basic Unisex hình gấu",
    description: "Áo Hoodie Basic Unisex hình gấu có thiết kế đơn giản, trẻ trung, phù hợp cho cả nam và nữ. Chất liệu nỉ bông mềm mại, giữ ấm tốt, hình gấu in sắc nét, dễ phối đồ cho đi học và đi chơi hằng ngày.",
    categoryName: "Áo Hoodie",
    price: 200000,
    images: [
      "/uploads/products/ao_hoodie_hinh_gau.png",
      "/uploads/products/ao_hoodie_hinh_gau_nu_be.png",
      "/uploads/products/ao_hoodie_hinh_gau_nu_xam.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Be", "Xám"],
    quantity: 100,
  },

  {
    name: "Áo Hoodie Basic Unisex Nam Nữ",
    description: "Áo Hoodie Basic Unisex nam nữ có thiết kế đơn giản, dễ mặc, phù hợp cho mọi phong cách. Chất liệu nỉ bông mềm mại, giữ ấm tốt, mang lại cảm giác thoải mái khi mặc hằng ngày.",
    categoryName: "Áo Hoodie",
    price: 250000,
    images: [
      "/uploads/products/ao_hoodie_nam_nu_hongden.png",
      "/uploads/products/ao_hoodie_nam_nu_trangxanh.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Hồng đen", "Trắng xanh"],
    quantity: 100,
  },

  {
    name: "Áo Sweater Nam Nữ Navy",
    description: "Áo sweater nam nữ màu navy có thiết kế basic, trẻ trung, dễ mặc cho cả nam và nữ. Chất liệu vải mềm mại, giữ ấm tốt, màu sắc thanh lịch, dễ phối đồ khi đi học, đi chơi hoặc dạo phố hằng ngày.",
    categoryName: "Áo Sweater",
    price: 300000,
    images: [
        "/uploads/products/ao_sweater_nam_nu_navy_den.png",
        "/uploads/products/ao_sweater_nam_nu_navy_trang.png",
        "/uploads/products/ao_sweater_nam_nu_navy_xam.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Trắng", "Xám"],
    quantity: 80,
  },

  {
    name: "Áo Sweater Nam Nữ phối túi DesignA",
    description: "Áo Sweater Nam Nữ phối túi DesignA có thiết kế hiện đại, trẻ trung với điểm nhấn túi phối độc đáo. Chất liệu vải mềm mại, giữ ấm tốt, form unisex dễ mặc, phù hợp cho đi học, đi chơi và dạo phố hằng ngày.",
    categoryName: "Áo Sweater",
    price: 320000,
    images: [
        "/uploads/products/ao_sweater_phoi_tui_designA_den.png",
        "/uploads/products/ao_sweater_phoi_tui_designA_kem.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Kem"],
    quantity: 80,
  },
  
  {
    name: "Áo Sweater Nam Nữ Targarem",
    description: "Áo Sweater Nam Nữ Targarem sở hữu thiết kế đơn giản, trẻ trung, phù hợp cho cả nam và nữ. Chất liệu vải mềm mại, giữ ấm tốt, form unisex dễ mặc, thích hợp cho đi học, đi chơi và sinh hoạt hằng ngày.",
    categoryName: "Áo Sweater",
    price: 280000,
    images: [
        "/uploads/products/ao_sweater_targarem.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Xanh"],
    quantity: 80,
  },

  {
    name: "Áo Sweater Nam Nữ Trơn",
    description: "Áo Sweater Nam Nữ trơn có thiết kế đơn giản, tinh tế, dễ mặc cho cả nam và nữ. Chất liệu vải mềm mại, giữ ấm tốt, form basic dễ phối đồ, phù hợp mặc hằng ngày.",
    categoryName: "Áo Sweater",
    price: 220000,
    images: [
        "/uploads/products/ao_sweater_tron_caphe.png",
        "/uploads/products/ao_sweater_tron_nau.png",
        "/uploads/products/ao_sweater_tron_reu.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Cà phê", "Nâu", "Rêu"],
    quantity: 80,
  },

  {
    name: "Áo Thun Nam Nữ LocalBrand FIDETEDDY",
    description: "Áo Thun Nam Nữ LocalBrand FIDETEDDY có thiết kế trẻ trung, năng động với họa tiết đặc trưng. Chất liệu cotton mềm mại, thoáng mát, form unisex dễ mặc, phù hợp cho đi học, đi chơi và sinh hoạt hằng ngày.",
    categoryName: "Áo Thun",
    price: 180000,
    images: [
      "/uploads/products/aothun_localbrand_FIDETEDDY_be.png",
      "/uploads/products/aothun_localbrand_FIDETEDDY_den.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Be", "Đen"],
    quantity: 150,
  },

  {
    name: "Áo Thun Nam Nữ LocalBrand Levent",
    description: "Áo Thun Nam Nữ LocalBrand Levent có thiết kế đơn giản, hiện đại, mang phong cách trẻ trung. Chất liệu cotton mềm mại, thoáng mát, form unisex dễ mặc, phù hợp cho đi học, đi chơi và mặc hằng ngày.",
    categoryName: "Áo Thun",
    price: 210000,
    images: [
      "/uploads/products/aothun_localbrand_levent_be.png",
      "/uploads/products/aothun_localbrand_levent_den.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Be", "Đen"],
    quantity: 130,
  },

  {
    name: "Áo Thun Nam Nữ LocalBrand Longbeach",
    description: "Áo Thun Nam Nữ LocalBrand Longbeach có thiết kế trẻ trung, năng động, mang phong cách streetwear hiện đại. Chất liệu cotton mềm mại, thoáng mát, form unisex dễ mặc, phù hợp cho đi học, đi chơi và mặc hằng ngày.",
    categoryName: "Áo Thun",
    price: 250000,
    images: [
      "/uploads/products/aothun_localbrand_longbeach_den.png",
      "/uploads/products/aothun_localbrand_longbeach_trang.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đen", "Trắng"],
    quantity: 130,
  },

  {
    name: "Áo Thun Nam Nữ MOTAGO chính hãng",
    description: "Áo Thun Nam Nữ MOTAGO chính hãng mang phong cách đơn giản, hiện đại, dễ mặc cho cả nam và nữ. Vải cotton mềm mại, thoáng mát, form unisex thoải mái, phù hợp mặc hằng ngày hoặc đi học, đi chơi",
    categoryName: "Áo Thun",
    price: 250000,
    images: [
      "/uploads/products/aothun_localbrand_MOTAGO_den.png",
      "/uploads/products/aothun_localbrand_MOTAGO_trang.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đen", "Trắng"],
    quantity: 130,
  },

  {
    name: "Áo dài cách tân Nam đẹp 2025",
    description: "Áo dài cách tân Nam đẹp 2025 có thiết kế hiện đại kết hợp truyền thống, tôn dáng và mang phong cách tinh tế. Chất liệu vải cao cấp, mềm mịn, thoáng mát, form chuẩn giúp nam giới tự tin trong nhiều dịp như lễ hội, sự kiện hay dạo phố.",
    categoryName: "Áo Dài",
    price: 450000,
    images: [
      "/uploads/products/aodai_cachtannam_do.png",
      "/uploads/products/aodai_cachtannam_trang.png",
      "/uploads/products/aodai_cachtannam_xanh.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ", "Trắng", "Xanh"],
    quantity: 130,
  },

  {
    name: "Áo dài cách tân Nữ đẹp 2025",
    description: "Áo dài cách tân Nữ đẹp 2025 có thiết kế tinh tế, hiện đại kết hợp với nét truyền thống, tôn vóc dáng và mang phong cách thanh lịch. Chất liệu vải cao cấp, mềm mại và thoáng mát, phù hợp với nhiều hoàn cảnh như dự tiệc, sự kiện, hay chụp ảnh kỷ niệm.",
    categoryName: "Áo Dài",
    price: 480000,
    images: [
      "/uploads/products/aodai_cachtannu_do.png",
      "/uploads/products/aodai_cachtannu_hong.png",
      "/uploads/products/aodai_cachtannu_tim.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ", "Hồng", "Tím"],
    quantity: 130,
  },

  {
    name: "Áo dài truyền thống Nam",
    description: "Áo dài truyền thống nam là trang phục mang đậm giá trị văn hóa Việt Nam, thiết kế dáng dài lịch lãm, tôn nét trang nghiêm và phong thái nam tính. Chất liệu vải cao cấp, mềm mại và thoáng mát, phù hợp cho các sự kiện trọng đại, lễ hội, cưới hỏi hoặc dịp lễ truyền thống.",
    categoryName: "Áo Dài",
    price: 500000,
    images: [
      "/uploads/products/aodai_truyenthongnam.png",
      "/uploads/products/aodai_truyenthongnam_do.png",
      "/uploads/products/aodai_truyenthongnam_xanh.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ", "Xanh"],
    quantity: 100,
  },

  {
    name: "Áo dài truyền thống Nữ",
    description: "Áo dài truyền thống nữ là trang phục tôn vinh vẻ đẹp dịu dàng, thanh lịch của người phụ nữ Việt Nam. Thiết kế dáng dài ôm nhẹ cơ thể, kết hợp chất liệu vải mềm mại, thoáng mát, phù hợp cho lễ hội, cưới hỏi, sự kiện và các dịp truyền thống.",
    categoryName: "Áo Dài",
    price: 480000,
    images: [
      "/uploads/products/aodai_truyenthongnu_do.png",
      "/uploads/products/aodai_truyenthongnu_trang.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ", "Trắng"],
    quantity: 100,
  },

  {
    name: "Áo dài Việt Nam Lạc Việt",
    description: "Áo dài Việt Nam Lạc Việt mang phong cách truyền thống đặc trưng, thể hiện nét đẹp văn hóa dân tộc qua thiết kế tinh tế và trang nhã. Chất liệu vải mềm mại, thoáng mát, phù hợp mặc trong các dịp lễ, sự kiện và không gian mang đậm bản sắc Việt.",
    categoryName: "Áo Dài",
    price: 550000,
    images: [
      "/uploads/products/aodai_vietnamnu_lacviet.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Trắng"],
    quantity: 100,
  },

  {
    name: "Áo khoác nam nữ Adidas chính hãng",
    description: "Áo khoác nam nữ Adidas chính hãng là sản phẩm thời trang thể thao năng động, phù hợp cả nam và nữ với thiết kế hiện đại và chất lượng chuẩn chính hãng. Chất liệu vải cao cấp, bền bỉ, thoáng khí giúp giữ ấm và thoải mái khi hoạt động, dễ phối cùng trang phục hằng ngày hoặc phong cách athleisure.",
    categoryName: "Áo Khoác",
    price: 650000,
    images: [
      "/uploads/products/aokhoac_adidas_den.png",
      "/uploads/products/aokhoac_adidas_trang.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đen", "Trắng"],
    quantity: 80,
  },

  {
    name: "Áo khoác nam nữ thể thao 2025",
    description: "Áo khoác nam nữ thể thao 2025 có thiết kế năng động, hiện đại phù hợp với xu hướng thời trang thể thao của năm 2025. Chất liệu vải cao cấp, thoáng khí và co giãn tốt, mang lại cảm giác thoải mái khi vận động. Form unisex dễ mặc, dễ phối đồ cho đi tập, đi chơi hoặc sinh hoạt hằng ngày.",
    categoryName: "Áo Khoác",
    price: 600000,
    images: [
      "/uploads/products/aokhoac_thethao_den.png",
      "/uploads/products/aokhoac_thethao_trang.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đen", "Trắng"],
    quantity: 80,
  },

  {
    name: "Áo khoác nam nữ thể thao Việt Nam 2025",
    description: "Áo khoác nam nữ thể thao Việt Nam 2025 là sản phẩm thời trang năng động, kết hợp phong cách thể thao hiện đại với sự thoải mái tối ưu. Chất liệu cao cấp, thoáng khí và co giãn tốt, mang lại cảm giác dễ chịu khi vận động hay di chuyển.",
    categoryName: "Áo Khoác",
    price: 800000,
    images: [
      "/uploads/products/aokhoac_Vietnam_do.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ"],
    quantity: 80,
  },

  {
    name: "Áo khoác nam nữ thể thao Wika",
    description: "Áo khoác nam nữ thể thao Wika có thiết kế trẻ trung và năng động, phù hợp cho cả nam và nữ. Chất liệu vải thể thao cao cấp, thoáng khí và co giãn tốt, mang lại sự thoải mái khi tập luyện, dạo phố hay hoạt động hằng ngày. Form unisex dễ phối đồ với nhiều phong cách khác nhau.",
    categoryName: "Áo Khoác",
    price: 700000,
    images: [
      "/uploads/products/aokhoac_wika_do.png",
      "/uploads/products/aokhoac_wika_xanh.png",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Đỏ", "Xanh"],
    quantity: 100,
  },

  {
    name: "Áo Sơ Mi cổ trụ nam Linen",
    description: "Áo sơ mi cổ trụ nam Linen có thiết kế tối giản, lịch sự và thoải mái, phù hợp cho phong cách trẻ trung hoặc công sở. Chất liệu linen (lanh) thoáng mát, thấm hút tốt, mang lại cảm giác dễ chịu cả ngày.",
    categoryName: "Áo Sơ Mi",
    price: 300000,
    images: [
        "/uploads/products/aosomi_cotru_Linen_xanh.png"
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Xanh"],
    quantity: 60,
  },

  {
    name: "Áo Sơ Mi ngắn tay sọc dài TEELAB",
    description: "Áo Sơ Mi ngắn tay sọc dài TEELAB có thiết kế trẻ trung, năng động với họa tiết sọc dọc tinh tế. Form dáng thoải mái, thích hợp cho cả đi chơi và dạo phố. Chất liệu vải nhẹ, thoáng mát, mang lại cảm giác dễ chịu khi mặc trong ngày hè hoặc thời tiết ấm áp.",
    categoryName: "Áo Sơ Mi",
    price: 260000,
    images: [
        "/uploads/products/aosomi_ngantay_TEELAB_den.png",
        "/uploads/products/aosomi_ngantay_TEELAB_hong.png",
        "/uploads/products/aosomi_ngantay_TEELAB_xanh.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Hồng", "Xanh"],
    quantity: 60,
  },

  {
    name: "Áo Sơ Mi cổ trụ nữ thời trang 2025",
    description: "Áo Sơ Mi cổ trụ nữ thời trang 2025 có thiết kế hiện đại, thanh lịch và phù hợp với xu hướng thời trang 2025. Form áo tối giản, tôn dáng, mang lại vẻ nữ tính nhưng vẫn thoải mái khi mặc. Chất liệu vải mềm mại, thoáng mát, dễ phối với quần jeans, váy hoặc quần tây cho nhiều hoàn cảnh từ đi làm, đi học đến đi chơi hằng ngày.",
    categoryName: "Áo Sơ Mi",
    price: 240000,
    images: [
        "/uploads/products/aosomi_nucotru_trang.png",
        "/uploads/products/aosomi_nucotru_xanh.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Trắng", "Xanh"],
    quantity: 80,
  },

  {
    name: "Áo Sơ Mi tay dài TEELAB",
    description: "Áo Sơ Mi tay dài TEELAB có thiết kế đơn giản, tinh tế và dễ phối đồ. Form tay dài lịch sự, phù hợp cả đi học, đi làm và dạo phố. Chất liệu vải mềm mại, thoáng mát, mang lại cảm giác thoải mái khi mặc suốt ngày dài.",
    categoryName: "Áo Sơ Mi",
    price: 300000,
    images: [
        "/uploads/products/aosomi_taydai_TEELAB_den.png",
        "/uploads/products/aosomi_taydai_TEELAB_trang.png",
        "/uploads/products/aosomi_taydai_TEELAB_xanh.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Trắng", "Xanh"],
    quantity: 100,
  },

  {
    name: "Áo Sơ Mi trắng công sở",
    description: "Áo Sơ Mi trắng công sở có thiết kế thanh lịch, trang nhã, phù hợp với môi trường làm việc chuyên nghiệp. Form chuẩn, dễ phối với quần tây hoặc chân váy, mang lại phong cách lịch sự và tự tin. Chất liệu vải mềm mại, thoáng mát, tạo cảm giác thoải mái khi mặc cả ngày.",
    categoryName: "Áo Sơ Mi",
    price: 350000,
    images: [
        "/uploads/products/aosomi_trangtron.png",
        "/uploads/products/aosomi_trangtron1.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Trắng"],
    quantity: 100,
  },

  {
    name: "Quần âu nam Aristino 2025",
    description: "Quần âu nam Aristino 2025 mang phong cách lịch lãm, hiện đại, phù hợp cho môi trường công sở và các dịp trang trọng. Chất liệu vải cao cấp, đứng form, thoải mái khi vận động, dễ phối cùng áo sơ mi hoặc vest.",
    categoryName: "Quần Âu",
    price: 400000,
    images: [
        "/uploads/products/quanau_aristino_den.png",
        "/uploads/products/quanau_aristino_xam.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Xám"],
    quantity: 100,
  },

  {
    name: "Quần âu nam thời trang form Hàn Quốc",
    description: "Quần âu nam thời trang form Hàn Quốc có thiết kế trẻ trung, thanh lịch với phom dáng chuẩn Hàn, tôn dáng và dễ phối đồ. Chất liệu vải mềm mại, thoáng mát và co giãn nhẹ, mang lại cảm giác thoải mái khi mặc cả ngày. Phù hợp cho đi làm, đi chơi hoặc các dịp cần phong cách thời trang hiện đại.",
    categoryName: "Quần Âu",
    price: 460000,
    images: [
        "/uploads/products/quanau_formhanquoc_be.png",
        "/uploads/products/quanau_formhanquoc_den.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Be", "Đen"],
    quantity: 100,
  },

  {
    name: "Quần âu nữ công sở",
    description: "Quần âu nữ công sở có thiết kế thanh lịch, tinh tế và dễ phối với áo sơ mi hoặc blazer. Chất liệu vải mềm mịn, co giãn nhẹ, mang lại cảm giác thoải mái khi mặc cả ngày. Phom dáng chuẩn, phù hợp cho môi trường làm việc chuyên nghiệp và các dịp trang trọng.",
    categoryName: "Quần Âu",
    price: 350000,
    images: [
        "/uploads/products/quanau_nucongso_den.png",
        "/uploads/products/quanau_nucongso_trang.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Trắng"],
    quantity: 100,
  },

  {
    name: "Quần âu nữ ống rộng thời trang 2024",
    description: "Quần âu nữ ống rộng thời trang 2024 có thiết kế hiện đại, phong cách với ống rộng thoải mái, tôn dáng và dễ dàng phối đồ. Chất liệu vải mềm mại, thoáng mát, phù hợp cho cả đi làm, đi chơi hay dạo phố.",
    categoryName: "Quần Âu",
    price: 320000,
    images: [
        "/uploads/products/quanau_nuongrong_be.png",
        "/uploads/products/quanau_nuongrong_nau.png",
        "/uploads/products/quanau_nuongrong_xam.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Be", "Nâu", "Xám"],
    quantity: 110,
  },

  {
    name: "Quần âu nam ống rộng thời trang 2024",
    description: "Quần âu nam ống rộng thời trang 2024 mang phong cách hiện đại, phom dáng rộng thoải mái, tạo cảm giác năng động và cá tính. Chất liệu vải nhẹ, dễ mặc, phù hợp cho nhiều hoàn cảnh từ đi làm đến dạo phố.",
    categoryName: "Quần Âu",
    price: 350000,
    images: [
        "/uploads/products/quanau_ongrong_den.png",
        "/uploads/products/quanau_ongrong_trang.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Trắng"],
    quantity: 110,
  },

  {
    name: "Quần Jean Nam ống suông thời trang 2025",
    description: "Quần Jean Nam ống suông thời trang 2025 có thiết kế hiện đại, phom ống suông thoải mái, phù hợp với phong cách streetwear và đời sống năng động.",
    categoryName: "Quần Jean",
    price: 250000,
    images: [
      "/uploads/products/quanjean_namsuong_den.png"
    ],
    sizes: ["29", "30", "31", "32"],
    colors: ["Đen"],
    quantity: 90,
  },

  {
    name: "Quần Jean thời trang nam",
    description: "Quần Jean thời trang nam có thiết kế trẻ trung, năng động và dễ phối đồ cho nhiều phong cách khác nhau. Chất liệu denim bền đẹp, form chuẩn mang lại sự thoải mái khi mặc hàng ngày, phù hợp đi chơi, dạo phố hoặc phong cách casual thường nhật.",
    categoryName: "Quần Jean",
    price: 290000,
    images: [
      "/uploads/products/quanjean_namthoitrang_den.png",
      "/uploads/products/quanjean_namthoitrang_bac.png",
      "/uploads/products/quanjean_namthoitrang_trang.png",
    ],
    sizes: ["29", "30", "31", "32"],
    colors: ["Đen", "Bạc", "Trắng"],
    quantity: 90,
  },

  {
    name: "Quần Jean thời trang nam trơn",
    description: "Quần Jean nam trơn mang phong cách tối giản, form dáng gọn gàng, dễ mặc và dễ phối đồ. Chất liệu denim bền bỉ, phù hợp sử dụng hằng ngày cho nhiều hoàn cảnh khác nhau.",
    categoryName: "Quần Jean",
    price: 310000,
    images: [
      "/uploads/products/quanjean_namtron_xanh.png",
      "/uploads/products/quanjean_namtron_bac.png",
    ],
    sizes: ["29", "30", "31", "32"],
    colors: ["Xanh", "Bạc"],
    quantity: 90,
  },

  {
    name: "Quần Jean thời trang nữ dáng chuẩn",
    description: "Quần Jean thời trang nữ dáng chuẩn tôn lên vóc dáng với phom ôm nhẹ, phong cách hiện đại và dễ phối đồ. Chất liệu denim co giãn, bền đẹp, mang lại cảm giác thoải mái khi mặc, phù hợp cho đi chơi, dạo phố và outfit hàng ngày.",
    categoryName: "Quần Jean",
    price: 230000,
    images: [
      "/uploads/products/quanjean_nuchuan_xanh.png",
      "/uploads/products/quanjean_nuchuan_den.png",
    ],
    sizes: ["29", "30", "31", "32"],
    colors: ["Xanh", "Đen"],
    quantity: 90,
  },

  {
    name: "Quần Jean thời trang nữ ống suông",
    description: "Quần Jean thời trang nữ ống suông có thiết kế hiện đại, phom ống suông thoải mái, mang lại phong cách năng động và sành điệu. Chất liệu denim co giãn, bền đẹp, dễ phối với áo thun, sơ mi hay áo khoác, phù hợp cho đi chơi, dạo phố và phong cách thường ngày.",
    categoryName: "Quần Jean",
    price: 290000,
    images: [
      "/uploads/products/quanjean_nusuong_xanh.png",
      "/uploads/products/quanjean_nusuong_ghi.png",
    ],
    sizes: ["29", "30", "31", "32"],
    colors: ["Xanh", "Ghi"],
    quantity: 90,
  },

  {
    name: "Quần Thể Thao Nam",
    description: "Quần Thể Thao Nam có thiết kế năng động, trẻ trung với chi tiết 3 sọc đặc trưng tạo điểm nhấn cá tính. Chất liệu vải thể thao co giãn, thoáng khí, mang lại sự thoải mái khi vận động. Phù hợp cho tập luyện, đi chơi hoặc hoạt động hằng ngày.",
    categoryName: "Quần Thể Thao",
    price: 150000,
    images: [
        "/uploads/products/quanthethao_3soc_den.png",
        "/uploads/products/quanthethao_3soc_trang.png",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Đen", "Trắng"],
    quantity: 120,
  },

  {
    name: "Đồng Hồ Nam Nữ Casio chính hãng",
    description: "Đồng hồ Nam Nữ Casio chính hãng là phụ kiện thời trang kết hợp với chất lượng bền bỉ của thương hiệu Casio. Thiết kế unisex phù hợp cho cả nam và nữ, dễ phối với mọi phong cách từ năng động đến lịch lãm.",
    categoryName: "Đồng Hồ Nam",
    price: 200000,
    images: ["/uploads/products/donghocasio.png"],
    sizes: ["20"],
    colors: ["Đen"],
    quantity: 40,
  },

  {
    name: "Đồng Hồ Nam FNGEEN thời thượng chính hãng",
    description: "Đồng hồ Nam FNGEEN thời thượng chính hãng là phụ kiện phong cách với thiết kế hiện đại, mạnh mẽ dành cho phái nam. Sản phẩm chính hãng đảm bảo chất lượng bền bỉ, hoạt động chính xác, phù hợp đeo hằng ngày hoặc trong các dịp đi chơi, đi làm.",
    categoryName: "Đồng Hồ Nam",
    price: 1200000,
    images: [
        "/uploads/products/donghonam_FNGEEN_den.png",
        "/uploads/products/donghonam_FNGEEN_trang.png",
        "/uploads/products/donghonam_FNGEEN_vang.png",
    ],
    sizes: ["18", "20", "22"],
    colors: ["Đen", "Trắng", "Vàng"],
    quantity: 50,
  },

  {
    name: "Đồng Hồ Nam Lobinni thời thượng chính hãng",
    description: "Đồng hồ Nam Lobinni thời thượng chính hãng là phụ kiện cao cấp với thiết kế sang trọng, tinh tế dành cho nam giới. Sản phẩm chính hãng đảm bảo chất lượng bền bỉ và độ chính xác cao, phù hợp để đeo đi làm, dự tiệc hay các dịp quan trọng.",
    categoryName: "Đồng Hồ Nam",
    price: 1500000,
    images: [
        "/uploads/products/donghonam_Lobinni_nau.png",
        "/uploads/products/donghonam_Lobinni_trang.png",
        "/uploads/products/donghonam_Lobinni_vang.png",
    ],
    sizes: ["18", "20", "22"],
    colors: ["Nâu", "Trắng", "Vàng"],
    quantity: 50,
  },

   {
    name: "Đồng Hồ Nữ GoGoey sang trọng lịch lãm",
    description: "Đồng hồ Nữ GoGoey sang trọng lịch lãm là phụ kiện thời trang tinh tế, thiết kế thanh lịch phù hợp với phái nữ. Sản phẩm nổi bật với kiểu dáng sang trọng, dễ phối đồ, phù hợp để đeo đi làm, dự tiệc hoặc gặp gỡ bạn bè.",
    categoryName: "Đồng Hồ Nữ",
    price: 2000000,
    images: [
        "/uploads/products/donghonam_GoGuey_den.png",
        "/uploads/products/donghonam_GoGuey_trang.png",
        "/uploads/products/donghonam_GoGuey_tim.png",
    ],
    sizes: ["16", "18", "20"],
    colors: ["Đen", "Trắng", "Tím"],
    quantity: 50,
  },

  {
    name: "Đồng Hồ Nữ Madocy sang trọng tôn vinh vẻ đẹp",
    description: "Đồng hồ Nữ Madocy sang trọng tôn vinh vẻ đẹp là phụ kiện thời trang tinh tế với thiết kế thanh lịch, nữ tính, giúp tôn lên phong cách và sự duyên dáng của phái đẹp. Sản phẩm dễ phối với nhiều trang phục, phù hợp đeo đi làm, dự tiệc hoặc các dịp đặc biệt.",
    categoryName: "Đồng Hồ Nữ",
    price: 2200000,
    images: [
        "/uploads/products/donghonam_Madocy_trang.png",
    ],
    sizes: ["16", "18", "20"],
    colors: ["Trắng"],
    quantity: 50,
  },

  {
    name: "Đồng Hồ Nữ Olevs sang trọng thời thượng quý phái",
    description: "Đồng hồ Nữ Olevs sang trọng thời thượng quý phái là phụ kiện đẳng cấp với thiết kế tinh xảo, hiện đại, mang đến vẻ đẹp quý phái và phong cách thời thượng cho phái nữ. Sản phẩm dễ phối với nhiều trang phục từ công sở đến dự tiệc, tôn lên sự nữ tính và tự tin.",
    categoryName: "Đồng Hồ Nữ",
    price: 1900000,
    images: [
        "/uploads/products/donghonam_Olevs_trang.png",
        "/uploads/products/donghonam_Olevs_xanh.png",
    ],
    sizes: ["16", "18", "20"],
    colors: ["Trắng", "Xanh"],
    quantity: 50,
  },

  {
    name: "Giày Thể Thao Unisex Adidas chính hãng",
    description: "Giày Thể Thao Unisex Adidas chính hãng là sản phẩm năng động, phong cách và chất lượng chuẩn thương hiệu Adidas. Thiết kế unisex phù hợp cho cả nam và nữ, với kiểu dáng thời thượng và êm chân khi đi lại hay vận động.",
    categoryName: "Giày Thể Thao",
    price: 1300000,
    images: [
      "/uploads/products/giay_Adidas.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Trắng"],
    quantity: 70,
  },

  {
    name: "Giày Unisex thời trang AF1",
    description: "Giày Unisex thời trang AF1 có thiết kế cổ điển, phong cách và dễ phối với nhiều outfit khác nhau. Form unisex phù hợp cả nam và nữ, mang lại vẻ trẻ trung, năng động. Đế êm, độ bám tốt và chất liệu bền đẹp, phù hợp đi chơi, dạo phố hoặc mặc hàng ngày.",
    categoryName: "Giày Thể Thao",
    price: 2300000,
    images: [
      "/uploads/products/giay_AF1_den.png",
      "/uploads/products/giay_AF1_trang.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Đen", "Trắng"],
    quantity: 70,
  },

  {
    name: "Giày Jodan bản chuẩn cổ cao chính hãng",
    description: "Giày Jordan bản chuẩn cổ cao chính hãng là mẫu giày thể thao biểu tượng với thiết kế cổ cao cá tính, mang đậm phong cách streetwear mạnh mẽ và thời thượng. Sản phẩm chính hãng đảm bảo chất lượng vượt trội với chất liệu cao cấp, độ bám tốt và êm ái khi di chuyển.",
    categoryName: "Giày Thể Thao",
    price: 1700000,
    images: [
      "/uploads/products/giay_Jodan_den.png",
      "/uploads/products/giay_Jodan_xam.png",
      "/uploads/products/giay_Jodan_xanh.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Đen", "Xám", "Xanh"],
    quantity: 70,
  },

  {
    name: "Giày thể thao MLB LA chính hãng",
    description: "Giày thể thao MLB chính hãng là sản phẩm thời trang thể thao năng động với thiết kế hiện đại và logo đặc trưng nổi bật. Sản phẩm chính hãng đảm bảo chất lượng, đế bám tốt, êm ái khi di chuyển, phù hợp cả đi chơi, dạo phố hay tập luyện nhẹ.",
    categoryName: "Giày Thể Thao",
    price: 1200000,
    images: [
      "/uploads/products/giay_MLB_LA_xanh.png",
      "/uploads/products/giay_MLB_LA.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Xanh"],
    quantity: 70,
  },

  {
    name: "Giày thể thao MLB NY chính hãng",
    description: "Giày thể thao MLB chính hãng là sản phẩm thời trang thể thao năng động với thiết kế hiện đại và logo đặc trưng nổi bật. Sản phẩm chính hãng đảm bảo chất lượng, đế bám tốt, êm ái khi di chuyển, phù hợp cả đi chơi, dạo phố hay tập luyện nhẹ.",
    categoryName: "Giày Thể Thao",
    price: 1400000,
    images: [
      "/uploads/products/giay_MLB_NY_xanh.png",
      "/uploads/products/giay_MLB_NY_hong.png",
      "/uploads/products/giay_MLB_NY_trang.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Xanh", "Hồng", "Trắng"],
    quantity: 70,
  },

  {
    name: "Giày thể thao NIKE chính hãng",
    description: "Giày thể thao NIKE chính hãng là sản phẩm thời trang thể thao nổi tiếng với thiết kế hiện đại, năng động và chất lượng chuẩn hãng. Đế giày êm ái, bám tốt, chất liệu cao cấp giúp thoáng khí và hỗ trợ vận động hiệu quả.",
    categoryName: "Giày Thể Thao",
    price: 2400000,
    images: [
      "/uploads/products/giay_Nike_xanh.png",
      "/uploads/products/giay_Nike_hong.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Xanh", "Hồng"],
    quantity: 70,
  },

  {
    name: "Giày thể thao Sneaker Nam Nữ thời trang chính hãng",
    description: "Giày thể thao Sneaker Nam Nữ thời trang chính hãng là sản phẩm unisex với thiết kế trẻ trung, sành điệu và dễ phối đồ. Chất liệu cao cấp, êm ái, bám tốt, phù hợp cho đi học, đi chơi, dạo phố hay hoạt động hằng ngày. Sản phẩm chính hãng đảm bảo chất lượng bền bỉ và phong cách thời trang hiện đại.",
    categoryName: "Giày Thể Thao",
    price: 1500000,
    images: [
      "/uploads/products/giay_sneaker_namnu_trang.png",
      "/uploads/products/giay_sneaker_namnu_xam.png",
    ],
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Trắng", "Xám"],
    quantity: 70,
  },
];

/* ================= RUN SEED ================= */
const runSeed = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Product.deleteMany();

    const insertedCategories = await Category.insertMany(categories);

    const categoryMap = {};
    insertedCategories.forEach((c) => {
      categoryMap[c.name] = c._id;
    });

    const finalProducts = products.map((p) => ({
      name: p.name,
      description: p.description,
      category: categoryMap[p.categoryName],
      price: p.price,
      images: p.images,
      sizes: p.sizes,
      colors: p.colors,
      quantity: p.quantity,
    }));

    await Product.insertMany(finalProducts);

    console.log("🎉 Seed Category & Product thành công");
    process.exit();
  } catch (error) {
    console.error("❌ Seed lỗi:", error);
    process.exit(1);
  }
};

runSeed();
