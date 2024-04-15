const config = {
  app: {
    port: process.env.PORT || 3000,
    serverURL: process.env.SERVER_URL,
    clientURL: process.env.CLIENT_URL,
  },
  db: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "test",
    port: process.env.DB_PORT || "3306",
  },
  jwt: {
    privateKeyAccessToken: process.env.PRIVATE_KEY_ACCESSTOKEN || "private-key1",
    privateKeyRefreshToken: process.env.PRIVATE_KEY_REFRESHTOKEN || "private-key2",
    expiredRefreshToken: process.env.EXPIRED_REFRESHTOKEN || "1w",
    expiredAccessToken: process.env.EXPIRED_ACCESSTOKEN || "30s",
  },
  oauth2: {
    clientID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET,
    clientRedirectURL: process.env.OAUTH2_GOOGLE_OAUTH_REDIRECT,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "test",
  },
  vnp: {
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_HashSecret: process.env.VNP_HASH_SECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_Api: process.env.VNP_API,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    currCode: "VND",
  },
  location: "vn",
  account: {
    password: process.env.GOGLE_PASSWORD,
    email: process.env.GOOGLE_MAIL,
  },
};

export default config;
