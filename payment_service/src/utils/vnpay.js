import crypto from "crypto";
import querystring from "querystring";

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });

  return sorted;
}

export const createVNPayUrl = ({
  orderId,
  amount,
  ipAddr,
  returnUrl,
}) => {
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;

  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-T:\.Z]/g, "")
    .slice(0, 14);

  let vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: `${orderId}${Date.now()}`,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr.includes(":") ? "127.0.0.1" : ipAddr,
    vnp_CreateDate: createDate,
  };

  // 1️⃣ sort + encode theo chuẩn VNPay
  const sortedParams = sortObject(vnpParams);

  // 2️⃣ TẠO CHUỖI KÝ – FIX CHÍNH Ở ĐÂY
  const signData = querystring.stringify(
    sortedParams,
    "&",
    "=",
    { encode: false }
  );

  console.log("SIGN DATA:", signData);

  // 3️⃣ ký SHA512
  const secureHash = crypto
    .createHmac("sha512", secretKey)
    .update(signData)
    .digest("hex");

  // 4️⃣ tạo URL redirect
  return (
    `${vnpUrl}?${querystring.stringify(sortedParams)}` +
    `&vnp_SecureHashType=SHA512` +
    `&vnp_SecureHash=${secureHash}`
  );
};
