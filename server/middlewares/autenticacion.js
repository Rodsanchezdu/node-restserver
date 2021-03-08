const  jwt =require('jsonwebtoken'); 


//===============================
//Verificar token
//==============================

let verificaToken =(req, res, next)=>{
  let token =req.get('token');
  
  jwt.verify(token, process.env.SEED, (err,  paylodDecoded)=>{
    

    if (err){
      return res.status(401).json({
        ok:false,
        err:{
          error:err,
          message:"Error en verificación de token"
        }
      }); 
    }

    req.usuario=paylodDecoded.usuario;
    // console.log('verificaToken:', req.usuario);
    next(); 
  });
};

let verificaRole =(req, res, next)=>{
  console.log('verificaRole:', req.usuario);

  let usuario=req.usuario; //ya debio pasar por middleware: verificaToken sino acá falla

  if(usuario.role!=='ADMIN_ROLE'){
    return res.status(401).json({
      ok: false,
      error: {
        message:'Necesita permisos de administrador'
      }
    });
  }

  //tiene role: ADMIN_ROLE
  next(); 

}

module.exports={verificaToken, verificaRole};
// module.exports=verificaRole;  



