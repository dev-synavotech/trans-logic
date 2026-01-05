require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ProviderModel = require('./models/providerModel');
const RouteModel = require('./models/routeModel');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.post('/providers/trucks', async (req, res) => {
  try {
    const payload = req.body;
    // Basic validation
    if (!payload.truck_type || !payload.truck_name || !payload.truck_number) {
      return res.status(400).json({ error: 'truck_type, truck_name and truck_number are required' });
    }

    const result = await ProviderModel.createTruck(payload);
    res.status(201).json({ id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET trucks with optional filters and pagination
app.get('/providers/trucks', async (req, res) => {
  try {
    const { type, min_capacity, location, page = 1, limit = 20 } = req.query;
    const filters = {
      type: type || undefined,
      min_capacity: min_capacity ? Number(min_capacity) : undefined,
      location: location || undefined,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    };

    const result = await ProviderModel.fetchTrucks(filters);
    res.json({ data: result.rows, total: result.total, page: filters.page, limit: filters.limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update truck
app.put('/providers/trucks/:truckId', async (req, res) => {
  try {
    const truckId = Number(req.params.truckId);
    if (!truckId) return res.status(400).json({ error: 'Invalid truck id' });
    const payload = req.body;
    const result = await ProviderModel.updateTruck(truckId, payload);
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete truck
app.delete('/providers/trucks/:truckId', async (req, res) => {
  try {
    const truckId = Number(req.params.truckId);
    if (!truckId) return res.status(400).json({ error: 'Invalid truck id' });
    const result = await ProviderModel.deleteTruck(truckId);
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes: create a route for a truck
app.post('/providers/trucks/:truckId/routes', async (req, res) => {
  try {
    const truckId = Number(req.params.truckId);
    const payload = req.body; // { name, notes, places: [{address, lat, lng}, ...] }
    if (!truckId) return res.status(400).json({ error: 'Invalid truck id' });
    const result = await RouteModel.createRoute(truckId, payload);
    res.status(201).json({ id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get routes for a truck
app.get('/providers/trucks/:truckId/routes', async (req, res) => {
  try {
    const truckId = Number(req.params.truckId);
    if (!truckId) return res.status(400).json({ error: 'Invalid truck id' });
    const routes = await RouteModel.fetchRoutesByTruck(truckId);
    res.json({ data: routes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a route
app.put('/providers/routes/:routeId', async (req, res) => {
  try {
    const routeId = Number(req.params.routeId);
    if (!routeId) return res.status(400).json({ error: 'Invalid route id' });
    await RouteModel.updateRoute(routeId, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a route
app.delete('/providers/routes/:routeId', async (req, res) => {
  try {
    const routeId = Number(req.params.routeId);
    if (!routeId) return res.status(400).json({ error: 'Invalid route id' });
    await RouteModel.deleteRoute(routeId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
