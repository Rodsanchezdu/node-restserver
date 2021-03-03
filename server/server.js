//archivo de configuración global
require('./config/config'); 
const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());




app.get('/', function (req, res) {
  res.json('Hello World');
});

app.get('/usuario', function (req, res) {
  res.json('get Usuario');
});
 
app.post('/usuario', function (req, res) {
  let body=req.body; 
  if(body.nombre===undefined){
    res.status(400).json({
      ok:false, 
      mensaje:'El nombre es necesario', 
      tip: 'no la embarre'
    });
  }else{
    res.json({
      persona:body
    });
  }
  
});

app.put('/usuario/:id', function (req, res) {
  let idCath=req.params.id; 
  res.json({
    id:idCath
  });
});
app.delete('/usuario', function (req, res) {
  res.json('delete Usuario');
});

app.listen(process.env.PORT, ()=>{
  console.log("escuchando el puerto 3000");
});