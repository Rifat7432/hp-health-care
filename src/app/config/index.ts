import dotenv from "dotenv";
import Path from "path";
dotenv.config({ path: Path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_reset_secret: process.env.JWT_RESET_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  super_admin_password: process.env.ADMIN_PASSWORD,
  emailSender_email:process.env.EMAIL_SENDER_EMAIL,
  emailSender_pass:process.env.EMAIL_SENDER_PASS,
  ssl: {
    sslPaymentUrl: process.env.SSL_PAYMENT_URL,
    validationUrl: process.env.VALIDATION_URL,
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASSWORD,
    successUrl: process.env.SUCCESS_URL,
    cancelUrl: process.env.CANCEL_URL,
    failUrl: process.env.FAIL_URL,
  },
};
