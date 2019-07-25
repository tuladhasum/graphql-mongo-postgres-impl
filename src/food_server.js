require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const foodRouter = require('./routes/FoodRoutes');

const app = express();
app.use(express.json());


mongoose.connect(process.env.ATLAS_CONNECTION, {
  useNewUrlParser: true
});

app.use(foodRouter);

app.listen(3000, () => {
  console.log('Server is running at 3000');
});

//https://alligator.io/nodejs/crud-operations-mongoose-mongodb-atlas/