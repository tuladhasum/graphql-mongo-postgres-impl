const express = require('express');
const foodModel = require('../models/FoodModel');
const app = express();

app.get('/foods', async (req, res) => {
  const foods = await foodModel.find({});

  try{
    res.send(foods);
  }catch(err){
    res.status(500).send(err);
  }
});

app.post('/foods', async(req,res)=>{
  const food = new foodModel(req.body);
  try{
    await food.save();
    res.send(food);
  }catch(err){
    res.status(500).send(err);
  }
});

app.delete('/foods/:id', async (req,res) => {
  try{
    const food = await foodModel.findByIdAndDelete(req.params.id);
    if(!food) res.status(404).send('No items found');
    res.status(200).send();
  }catch(err){
    res.status(500).send(err);
  }
});

app.patch('/foods/:id', async (req,res) => {
  try{
    await foodModel.findByIdAndUpdate(req.params.id,req.body);
    await foodModel.save();
    res.send(food);
  }catch(err){
    res.status(500).send(err);
  }
});

module.exports = app;