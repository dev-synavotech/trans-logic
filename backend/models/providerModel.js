const pool = require('../db');

class ProviderModel {
  static async createTruck(payload) {
    const {
      truck_type,
      truck_name,
      truck_number,
      actual_length,
      actual_width,
      actual_height,
      available_length,
      available_width,
      available_height,
      capacity_tons,
      availability_status,
      origin,
      destination,
      notes,
    } = payload;

    const conn = await pool.getConnection();
    try {
      const params = [
        truck_type ?? null,
        truck_name ?? null,
        truck_number ?? null,
        typeof actual_length === 'undefined' ? null : actual_length,
        typeof actual_width === 'undefined' ? null : actual_width,
        typeof actual_height === 'undefined' ? null : actual_height,
        typeof available_length === 'undefined' ? null : available_length,
        typeof available_width === 'undefined' ? null : available_width,
        typeof available_height === 'undefined' ? null : available_height,
        typeof capacity_tons === 'undefined' ? null : capacity_tons,
        availability_status ?? 'Available',
        origin ?? null,
        destination ?? null,
        notes ?? null,
      ];

      // Normalize params: replace any `undefined` with `null` to satisfy mysql2
      console.log('ProviderModel.createTruck initial params:', params);
      for (let i = 0; i < params.length; i++) {
        if (typeof params[i] === 'undefined') {
          console.warn(`ProviderModel.createTruck: param[${i}] is undefined — coercing to null`);
          params[i] = null;
        }
      }
      console.log('ProviderModel.createTruck normalized params:', params);
      try {
        const [result] = await conn.execute(
          `INSERT INTO trucks (
            truck_type, truck_name, truck_number,
            actual_length, actual_width, actual_height,
            available_length, available_width, available_height,
            capacity_tons, availability_status, origin, destination, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)`,
          params
        );
        return { id: result.insertId };
      } catch (err) {
        console.error('Error executing insert, params:', params);
        throw err;
      }
      return { id: result.insertId };
    } finally {
      conn.release();
    }
  }

  static async fetchTrucks({ type, min_capacity, location, limit = 20, page = 1 }) {
    const conn = await pool.getConnection();
    try {
      const where = [];
      const params = [];

      if (type) {
        where.push('truck_type = ?');
        params.push(type);
      }

      if (min_capacity) {
        where.push('capacity_tons >= ?');
        params.push(min_capacity);
      }

      if (location) {
        // search in origin or destination
        where.push('(origin LIKE ? OR destination LIKE ?)');
        params.push(`%${location}%`, `%${location}%`);
      }

      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const lim = Number(limit) || 20;
      const pg = Number(page) || 1;
      const offset = (pg - 1) * lim;

      // minimal fields for the UI
      // Inline LIMIT/OFFSET into SQL to avoid driver/server issues with parameterizing them
      const countSql = `SELECT COUNT(*) as total FROM trucks ${whereSql}`;

      // normalize params to avoid undefined values
      const normalizedParams = params.map((p) => (typeof p === 'undefined' ? null : p));
      console.log('ProviderModel.fetchTrucks:', { whereSql, params: normalizedParams, limit: lim, offset });
      const [countRows] = await conn.execute(countSql, normalizedParams);
      const total = countRows && countRows[0] ? countRows[0].total : 0;

      // Inline limit/offset directly into SQL (numbers are safe since they are coerced above)
      // include full fields needed for editing plus a combined route_summary (Origin - Destination)
      const selectSql = `SELECT id, truck_type, truck_name, truck_number, actual_length, actual_width, actual_height, available_length, available_width, available_height, capacity_tons, availability_status, origin, destination, notes, CONCAT_WS(' - ', NULLIF(origin, ''), NULLIF(destination, '')) AS route_summary, COALESCE(origin, '') AS location FROM trucks ${whereSql} ORDER BY id DESC LIMIT ${lim} OFFSET ${offset}`;
      console.log('ProviderModel.fetchTrucks executing:', { selectSql, params: normalizedParams });
      const [rows] = await conn.execute(selectSql, normalizedParams);

      return { rows, total };
    } finally {
      conn.release();
    }
  }

  static async updateTruck(id, payload) {
    const conn = await pool.getConnection();
    try {
      const {
        truck_type,
        truck_name,
        truck_number,
        actual_length,
        actual_width,
        actual_height,
        available_length,
        available_width,
        available_height,
        capacity_tons,
        availability_status,
        origin,
        destination,
        notes,
      } = payload;

      const params = [
        truck_type ?? null,
        truck_name ?? null,
        truck_number ?? null,
        typeof actual_length === 'undefined' ? null : actual_length,
        typeof actual_width === 'undefined' ? null : actual_width,
        typeof actual_height === 'undefined' ? null : actual_height,
        typeof available_length === 'undefined' ? null : available_length,
        typeof available_width === 'undefined' ? null : available_width,
        typeof available_height === 'undefined' ? null : available_height,
        typeof capacity_tons === 'undefined' ? null : capacity_tons,
        availability_status ?? 'Available',
        origin ?? null,
        destination ?? null,
        notes ?? null,
        id,
      ];

      const [result] = await conn.execute(
        `UPDATE trucks SET
          truck_type = ?, truck_name = ?, truck_number = ?,
          actual_length = ?, actual_width = ?, actual_height = ?,
          available_length = ?, available_width = ?, available_height = ?,
          capacity_tons = ?, availability_status = ?, origin = ?, destination = ?, notes = ?
         WHERE id = ?`,
        params
      );
      return { affectedRows: result.affectedRows };
    } finally {
      conn.release();
    }
  }

  static async deleteTruck(id) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(`DELETE FROM trucks WHERE id = ?`, [id]);
      return { affectedRows: result.affectedRows };
    } finally {
      conn.release();
    }
  }
}

module.exports = ProviderModel;
