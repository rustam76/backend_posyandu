const express = require('express');
const app = express();
const routes = require('./src/routes/routes');


app.use(express.json());

// API routes with JWT protection
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello World');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
