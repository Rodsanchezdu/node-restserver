const express = require("express");
const bcryp = require("bcrypt");
var jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();
const Usuario = require("../models/usuario");

app.post("/login", (req, res) => {
  let body = req.body;

  usuario.findOne({ email: body.email }, (error, usuarioDB) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error: error,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: "(Usuario) o contraseña incorrectos",
        },
      });
    }

    if (!bcryp.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        error: {
          message: "Usuario o (contraseña) incorrectos",
        },
      });
    }

    //paso todas las validaciones

    let token = jwt.sign(
      { usuario: usuarioDB }, //payload
      process.env.SEED, //seed
      { expiresIn: process.env.CADUCIDAD_TOKEN } //options
    );

    res.json({
      ok: true,
      usuario: usuarioDB,
      token: token,
    });
  });
});

//configuraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload.email);

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}
// verify().catch(console.error); TODO: implementar luego

//Es llamado desde el html de la carpeta pública.
app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  //console.log(token);

  let googleUser = await verify(token).catch((error) => {
    return res.status(403).json({
      ok: false,
      error: error,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    //verificar que se obtenga algo de la DB que no sea error
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err,
      });
    }

    //verificar que haya un usuario en la base
    if (usuarioDB) {

      //verificar que no sea un usuario que se autentique por corre
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe de usar su autenticación normal",
          },
        });
      } else { 
      //es usuario con autenticación por google

        let token = jwt.sign(
          { usuario: usuarioDB }, //payload
          process.env.SEED, //seed
          { expiresIn: process.env.CADUCIDAD_TOKEN } //options
        );

        return res.json({
          ok:true, 
          usuario:usuarioDB, 
          token
        });
      }
    }else{ 
    //el usuario no existe en la base de datos=> se crea

      let usuario= new Usuario();

      usuario.nombre=googleUser.nombre;
      usuario.email=googleUser.email;
      usuario.img=googleUser.img;
      usuario.google=true; 
      usuario.password=':)'; //solo para pasar la validación en la DB

      usuario.save((err, usuarioDB)=>{
        if (err) {
          return res.status(500).json({
            ok: false,
            err: err,
          });
        }

        let token = jwt.sign(
          { usuario: usuarioDB }, //payload
          process.env.SEED, //seed
          { expiresIn: process.env.CADUCIDAD_TOKEN } //options
        );

        return res.json({
          ok:true, 
          usuario:usuarioDB, 
          token
        });

      })


    }
  });

  // res.json({
  //   usuario:googleUser
  // });
});

module.exports = app;
