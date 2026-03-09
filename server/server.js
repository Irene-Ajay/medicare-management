const jsonServer = require('json-server');
const path       = require('path');

const server     = jsonServer.create();
const router     = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares= jsonServer.defaults();

// Allow all CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') { res.sendStatus(200); return; }
  next();
});

server.use(middlewares);

// Custom route: simulated login
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;                       // lowdb instance
  const user = db.get('users').find({ email, password }).value();
  if (user) {
    const { password: _pw, ...safe } = user;
    res.json({ success: true, user: safe, token: `demo-token-${safe.id}` });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  MediCare Pro – Backend Server           ║`);
  console.log(`║  JSON Server running on port ${PORT}         ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
  console.log(`  API Endpoints:`);
  console.log(`  GET    http://localhost:${PORT}/doctors`);
  console.log(`  GET    http://localhost:${PORT}/patients`);
  console.log(`  GET    http://localhost:${PORT}/appointments`);
  console.log(`  POST   http://localhost:${PORT}/appointments`);
  console.log(`  PATCH  http://localhost:${PORT}/appointments/:id`);
  console.log(`  GET    http://localhost:${PORT}/medicalRecords`);
  console.log(`  POST   http://localhost:${PORT}/auth/login\n`);
});
