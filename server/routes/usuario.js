const express = require("express");
const bcryp = require("bcrypt");
const _ = require("underscore");

const app = express();
const {verificaToken}=require("../middlewares/autenticacion");
const {verificaRole} =require("../middlewares/autenticacion");

const Usuario = require("../models/usuario");

app.get("/",function (req, res) {
  res.json("Hello World");
});

app.get("/usuario", [verificaToken], function (req, res) {

  let desde = req.query.desde;
  desde=Number(desde); 
  let cuantos= req.query.cuantos;  
  cuantos =Number(cuantos);
  console.log(cuantos);

  Usuario.find({'estado':true}, 'nombre email role estado google img')
         .skip(desde)
         .limit(cuantos)
         .exec((error, usuarios) => {
            if (error) {
              console.log("hola mundo");
              res.status(400).json({
                ok: false,
                error: error,
              });
              return; 
            }

            Usuario.count({'estado':true}, (error, conteo)=>{
              
              res.json({
                ok: true,
                cuantos:conteo,
                usuarios: usuarios,
              });

            })
        
            
        });
});

app.post("/usuario",[verificaToken, verificaRole] , function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcryp.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((error, usuarioDB) => {
    if (error) {
      console.log("hola mundo");
      res.status(400).json({
        ok: false,
        error: error,
      });
      return;
    }

    //se modificará loq ue viene en el callback para que el usuario no vea la contraseña
    //usuarioDB.password=null; //acá saldrá con null pero seguirá saliendo. PELIGROSO
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
    return;
  });
});

app.put("/usuario/:id",[verificaToken, verificaRole] , function (req, res) {
  let idCath = req.params.id;
  let body = req.body;
  //==============/
  //dejando de lo que viene solo lo que queremos que modifique
  //==============/

  let bodyValido = _.pick(body, "nombre", "email", "img", "role", "estado");

  Usuario.findByIdAndUpdate(
    idCath,
    bodyValido,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        console.log("hola mundo1111");
        res.status(400).json({
          ok: false,
          error: err,
        });
        return;
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

//Borrado solo cambiando el estado a false
app.delete("/usuario/:id",[verificaToken, verificaRole], function (req, res) {
  let id= req.params.id;

  /* ===== Borrado físico de la DB , no usar mejor========
  Usuario.findByIdAndRemove(id, (error, usuarioBorrado)=>{
  */

  Usuario.findByIdAndUpdate( id, {estado:false}, (error, usuarioBorrado)=>{
    
    if (error) {
      res.status(400).json({
        ok: false,
        error: error,
      });
      return;
    }

    //por si andan queriendo borrar un usuario que no existe
    if(!usuarioBorrado){
      console.log("hola mundo");
      res.status(400).json({
        ok: false,
        error: {
          message:'Usuario no exist en la base de datos'
        }
      });
      return;
    }

    res.json({
      ok:true, 
      usuario:usuarioBorrado
    });
    

  }); 


});

module.exports = app;
