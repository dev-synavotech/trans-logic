require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ProviderModel = require('./models/providerModel');
const RouteModel = require('./models/routeModel');
const UserModel = require('./models/userModel');
const bcrypt = require('bcryptjs');
const { runMigrations } = require('./migrate');
const jwt = require('jsonwebtoken');
const { authenticate, authorizeRole } = require('./auth');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'username, email, password and role are required' });
    }

    const allowed = ['Provider', 'Customer'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = bcrypt.hashSync(password, 10);
    const result = await UserModel.createUser({ username, email, password_hash, role });
    res.status(201).json({ id: result.id, message: 'User created' });
  } catch (err) {
    console.error('Registration error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint -> returns JWT
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'change-this-secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Current user profile
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthenticated' });
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // avoid leaking password hash
    const { password_hash, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    console.error('Profile error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/providers/trucks', authenticate, authorizeRole('Provider'), async (req, res) => {
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
app.get('/providers/trucks', authenticate, authorizeRole('Provider'), async (req, res) => {
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
app.put('/providers/trucks/:truckId', authenticate, authorizeRole('Provider'), async (req, res) => {
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
app.delete('/providers/trucks/:truckId', authenticate, authorizeRole('Provider'), async (req, res) => {
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
app.post('/providers/trucks/:truckId/routes', authenticate, authorizeRole('Provider'), async (req, res) => {
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
app.get('/providers/trucks/:truckId/routes', authenticate, authorizeRole('Provider'), async (req, res) => {
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

// Run migrations then start server
runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  });
