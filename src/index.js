const express = require('express');
const categoryRouter = require('./routes/category.routes');
const unitRouter = require('./routes/unit.routes');
const productRouter = require('./routes/product.routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = 'localhost';


app.use(express.json());

// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/units', unitRouter);
app.use('/api/products', productRouter);

app.get('/', (req, res) => {
    res.send('API is running successfully');
});

// Start the server
app.listen(Number(port), host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

module.exports = app;
