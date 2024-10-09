const express = require('express');
const app = express();
const routes = require('./src/routes/routes');
const authRoutes = require('./src/routes/authRoute'); // Auth routes


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Auth routes
app.use('/auth', authRoutes);

// API routes with JWT protection
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
