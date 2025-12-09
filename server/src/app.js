const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Route for monitoring server health. Things like uptime, hostname, etc. Useful for k8s liveness/readiness probes.
const healthRouter = require('./routes/server.health.routes.js');

// App routes
// Auth routes
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');
const serviceRouter = require('./routes/service.routes.js');
const bookingRouter = require('./routes/booking.routes.js');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/server_health_status', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/services', serviceRouter);
app.use('/api/bookings', bookingRouter);

// 404


module.exports = app;
