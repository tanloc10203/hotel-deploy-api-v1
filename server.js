import "dotenv/config";
import app from "./src/app.js";
import config from "./src/config/index.js";

const PORT = config.app.port;

process.env.TZ = "Asia/Ho_Chi_Minh";

app.listen(PORT, () => {
  console.log(`API RUNNING ON http://localhost:${PORT}`);
});
