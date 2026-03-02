const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Railway load balancer)

const { apiLimiter, authLimiter } = require('./api/middlewares/rateLimiter');

// Middlewares
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS policy: origin '${origin}' not allowed`));
    },
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Routes
const authRoutes = require('./api/routes/auth');
const requestRoutes = require('./api/routes/requests');
const adminRoutes = require('./api/routes/admin');
const userRoutes = require('./api/routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Doctor Service Backend running on port ${PORT}`);
});

module.exports = app;
