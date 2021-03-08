//archivo de configuración global
require('./config/config'); 
const express = require('express');
const mongoose = require('mongoose');
const path=require('path');

const bodyParser = require('body-parser'); 
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
console.log(path.resolve( __dirname ,'../public'));
app.use(express.static(path.resolve( __dirname ,'../public')));

//==== configuración global de rutas==============//
//ojo que si se coloca antes del body-parse error porque eso se ejecuta en línea. 
app.use(require('./routes/index'));







mongoose.connect(process.env.URLBD, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (error, resp)=>{
  if(error) {
    console.log("******el error", error);
    throw error;
  } 

  console.log("Base de datos ONLINE");
});



app.listen(process.env.PORT, ()=>{
  console.log("escuchando el puerto 3000");
});