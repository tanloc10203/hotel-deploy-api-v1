import _ from "lodash";
import SQLString from "sqlstring";
import pool from "./init.mysql.js";

class DBModel {
  _table;

  constructor(table) {
    this._table = table;
  }

  getTable = () => this._table;

  find = async ({ table = this._table, conditions = {}, select = [] }) => {
    try {
      if (_.isEmpty(conditions)) {
        const array = select.length
          ? [select, this._table]
          : [table || this._table];

        const sql = SQLString.format(
          `SELECT ${select.length ? "??" : "*"} FROM ??`,
          array
        );

        const [result] = await pool.query(sql);

        return result;
      }

      let values = [];
      let whereBy = "";

      Object.keys(conditions).forEach((condition, index) => {
        if (index > 0) {
          whereBy += " AND ";
        }

        whereBy += `\`${condition}\` = ?`;
        values = [...values, conditions[condition]];
      });

      const _sql = `SELECT ${
        select.length ? "??" : "*"
      } FROM ?? WHERE ${whereBy}`;

      const array = select.length
        ? [select, table || this._table, ...values]
        : [table || this._table, [...values]];

      const sql = SQLString.format(_sql, array);

      const [result] = await pool.query(sql);

      return !_.isEmpty(result[0]) && result[0];
    } catch (error) {
      console.log("error find db", error);
      return Promise.reject(error);
    }
  };

  findAll = async ({ table = this._table, conditions = {}, select = [] }) => {
    try {
      let values = [];
      let whereBy = "";

      if (!_.isEmpty(conditions)) {
        Object.keys(conditions).forEach((condition, index) => {
          if (index > 0) {
            whereBy += " AND ";
          }

          whereBy += `\`${condition}\` = ?`;
          values = [...values, conditions[condition]];
        });
      }

      const array = whereBy
        ? select.length
          ? [select, table, ...values]
          : [table, ...values]
        : select.length
        ? [select, table]
        : [table];

      const prepare = !whereBy
        ? `SELECT ${select.length ? "??" : "*"} FROM ??`
        : `SELECT ${select.length ? "??" : "*"} FROM ?? WHERE ${whereBy}`;

      const sql = SQLString.format(prepare, array);

      const [result] = await pool.query(sql);

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  insert = async ({ table = this._table, data = {} }) => {
    try {
      const sql = SQLString.format("INSERT INTO ?? SET ?", [table, data]);

      const [result] = await pool.query(sql);

      return result.affectedRows === 0 ? false : true;
    } catch (error) {
      console.log("error insert:::", error);
      return Promise.reject(error);
    }
  };

  /**
   *
   * @param {{table: string, data: Array<String>, insertFields: Array<String>}} param0
   * @returns
   */
  insertBulk = async ({
    table = this._table,
    data = [],
    insertFields = [],
  }) => {
    try {
      /**
       * * input: ["user_id", "price", "bill_id"]
       * * output: "`user_id`,`bill_id`,`price`"
       */
      const _insertFields =
        this._parserFieldArrayToStringForInsertBulk(insertFields);

      const sql = `INSERT INTO ?? (${_insertFields}) VALUES ?`;

      const [result] = await pool.query(sql, [table || this._table, data]);

      return result.affectedRows === 0 ? false : true;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  handleUpdate = async ({
    table = this._table,
    data = {},
    id = "",
    idField = "",
  }) => {
    try {
      const sql = SQLString.format("UPDATE ?? SET ? WHERE ?? = ?", [
        table || this._table,
        data,
        idField,
        id,
      ]);

      const [result] = await pool.query(sql);

      return result.affectedRows === 0 ? false : true;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  delete = async ({ table = this._table, id = "", idField = "" }) => {
    const q = SQLString.format("DELETE FROM ?? WHERE ??=?", [
      table,
      idField,
      id,
    ]);

    const [result] = await pool.query(q);

    return result;
  };

  _parserFieldArrayToStringForInsertBulk = (fileds = []) => {
    return fileds.map((filed) => `\`${filed}\``).join(",");
  };
}

export default DBModel;
