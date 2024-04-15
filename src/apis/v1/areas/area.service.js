import { pool } from "../../../database/index.js";
import results from "./data.js";

const create = async () => {
  try {
    const data = results.map((item) => [
      item.arse_id,
      item.arse_name,
      item.arse_type,
    ]);

    const sql = "INSERT INTO `areas` (arse_id, arse_name, arse_type) VALUES ?";

    await pool.query(sql, [data]);

    return true;
  } catch (error) {
    Promise.reject(error);
  }
};

export { create };
