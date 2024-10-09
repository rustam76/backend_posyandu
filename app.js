const express = require('express');
const app = express();
const routes = require('./src/routes/routes');


app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 

// API routes with JWT protection
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello World');
});


const PORT = process.env.PORT || 3400;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
