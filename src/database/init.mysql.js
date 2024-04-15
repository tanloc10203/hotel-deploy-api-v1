import mysql from "mysql2";
import config from "../config/index.js";

console.log(`db config:::`, config.db);

const pool = mysql
  .createPool({
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10,
    port: config.db.port,
  })
  .promise();

export default pool;
