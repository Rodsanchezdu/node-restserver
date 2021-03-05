


//========================================================
// PUERTO 
//========================================================
 //toma la de Heroku o toma esta por defecto
process.env.PORT=process.env.PORT || 3000;

//========================================================
// ENTORNO 
//========================================================
process.env.NODE_ENV=process.env.NODE_ENV || 'dev'; 

//========================================================
// BASE DE DATOS 
//========================================================
let urlDB; 

if( process.env.NODE_ENV==='dev'){
  urlDB= 'mongodb://localhost:27017/my_database';
}else{
  urlDB= 'mongodb+srv://myUser:3103332119@cluster0.0g9ei.mongodb.net/cafeDB?retryWrites=true&w=majority';
}

process.env.URLBD=urlDB; 



/* 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://myUser:<password>@cluster0.0g9ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/