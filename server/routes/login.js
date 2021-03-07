const express = require("express");
const bcryp = require("bcrypt");
var jwt = require('jsonwebtoken');


const app = express();
const usuario = require("../models/usuario");


app.post('/login', (req, res) => {

  let body = req.body;

  usuario.findOne({email:body.email}, (error, usuarioDB)=>{

    if (error) {
      return  res.status(500).json({
        ok: false,
        error: error,
      });
    }

    if(!usuarioDB){
      return  res.status(400).json({
          ok: false,
          error: {
            message:'(Usuario) o contraseña incorrectos'
          },
        });
    }
    
    if(!bcryp.compareSync(body.password, usuarioDB.password)){
      return  res.status(400).json({
        ok: false,
        error: {
          message:'Usuario o (contraseña) incorrectos'
        },
      });
    }

    //paso todas las validaciones

    let token =jwt.sign(
                    {usuario:usuarioDB}, //payload
                    process.env.SEED,    //seed
                    {expiresIn:process.env.CADUCIDAD_TOKEN} //options
    );

    res.json({
      ok:true, 
      usuario:usuarioDB, 
      token:token
    });
        
  });
});


module.exports = app;