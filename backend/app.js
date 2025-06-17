const express = require('express');
const cors = require('cors');
const docsRoutes = require('./routes/docs.routes');
const connection = require('./db/db');
const errorHandler = require('./middleware/error.middleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
connection();

app.get('/', (req, res) => {
  res.send('Welcome to the Docs API');
});
app.use('/api/docs', docsRoutes);

// Error handler (should be after all route handlers)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

