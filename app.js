const express = require('express');
const app = express();
const routes = require('./src/routes/routes');
const authRoutes = require('./src/routes/authRoute'); // Auth routes

// Middleware for JSON parsing
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);

// API routes with JWT protection
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
