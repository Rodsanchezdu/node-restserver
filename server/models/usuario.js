const mongoose = require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

let rolesValidos={
  values:['ADMIN_ROLE', 'USER_ROLE'], 
  message:'{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema; 

let usuarioSchema = new Schema ({
  nombre: {
    type:String, 
    required:[true, 'El nombre es necesario']
  }, 
  email:{
    type:String,
    unique:true,
    required:[true, 'el correo es necesario']
  }, 
  password:{
    type:String, 
    required:[true, 'la contraseña es obligatoria']
  }, 
  img:{
    type:String, 
    required:false
  },
  role:{
    type:String, 
    default:'USER_ROLE', 
    enum: rolesValidos
  }, 
  estado:{
    type:Boolean, 
    default:true
  }, 
  google:{
    type:Boolean, 
    default:false
  }

}); 

//***evitando que la contraseña sea impresa en la respuesta 
//para esto se modifica la función que da la respuesta: methos.toJSON
usuarioSchema.methods.toJSON=function (){
  let user=this; 
  let userObject=user.toObject();
  delete userObject.password; //se quita la contrasña de la respuesta

  return userObject; 
};

usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe de ser único'})

// acá se le hace un cambio al nombre que se usara al otro lado, ya no tendrá al final Schema
module.exports=mongoose.model('Usuario', usuarioSchema);