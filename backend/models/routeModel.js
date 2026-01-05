const pool = require('../db');

class RouteModel {
  static async createRoute(truckId, { name, notes, places }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [res] = await conn.execute(
        `INSERT INTO routes (truck_id, name, notes) VALUES (?, ?, ?)`,
        [truckId, name ?? null, notes ?? null]
      );
      const routeId = res.insertId;

      if (Array.isArray(places) && places.length > 0) {
        const placeParams = [];
        const placeholders = [];
        for (let i = 0; i < places.length; i++) {
          const p = places[i];
          placeholders.push('(?, ?, ?, ?)');
          placeParams.push(routeId, i + 1, p.address, p.lat ?? null);
          // NOTE: we'll push lng later in corrected order below; keep params aligned
        }
        // Our earlier push missed lng; rebuild properly
        const correctedParams = [];
        const valuesSql = [];
        for (let i = 0; i < places.length; i++) {
          const p = places[i];
          valuesSql.push('(?, ?, ?, ?, ?)');
          correctedParams.push(routeId, i + 1, p.address, p.lat ?? null, p.lng ?? null);
        }
        const insertPlacesSql = `INSERT INTO route_places (route_id, seq, address, lat, lng) VALUES ${valuesSql.join(',')}`;
        await conn.execute(insertPlacesSql, correctedParams);
      }

      await conn.commit();
      return { id: routeId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  static async fetchRoutesByTruck(truckId) {
    const conn = await pool.getConnection();
    try {
      const [routes] = await conn.execute(
        'SELECT id, truck_id, name, notes, created_at FROM routes WHERE truck_id = ? ORDER BY id DESC',
        [truckId]
      );

      for (const r of routes) {
        const [places] = await conn.execute(
          'SELECT id, seq, address, lat, lng FROM route_places WHERE route_id = ? ORDER BY seq ASC',
          [r.id]
        );
        r.places = places;
      }

      return routes;
    } finally {
      conn.release();
    }
  }

  static async deleteRoute(routeId) {
    const conn = await pool.getConnection();
    try {
      await conn.execute('DELETE FROM routes WHERE id = ?', [routeId]);
      return { success: true };
    } finally {
      conn.release();
    }
  }

  static async updateRoute(routeId, { name, notes, places }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute('UPDATE routes SET name = ?, notes = ? WHERE id = ?', [name ?? null, notes ?? null, routeId]);

      // simple strategy: delete existing places and re-insert
      await conn.execute('DELETE FROM route_places WHERE route_id = ?', [routeId]);
      if (Array.isArray(places) && places.length > 0) {
        const valuesSql = [];
        const params = [];
        for (let i = 0; i < places.length; i++) {
          const p = places[i];
          valuesSql.push('(?, ?, ?, ?, ?)');
          params.push(routeId, i + 1, p.address, p.lat ?? null, p.lng ?? null);
        }
        const insertPlacesSql = `INSERT INTO route_places (route_id, seq, address, lat, lng) VALUES ${valuesSql.join(',')}`;
        await conn.execute(insertPlacesSql, params);
      }

      await conn.commit();
      return { success: true };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

module.exports = RouteModel;
