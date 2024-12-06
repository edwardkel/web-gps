//import {__dirname} from "node/globals";

const express = require("express");
const app = express();
var router = require('router');
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const bodyParser = require('body-parser')
const server = http.createServer(app);
const io = socketio(server);
const mysql = require('mysql');
//var request = require('request');
let cors = require("cors");

//function BD(){

  var db_con = mysql.createConnection({
    host:'globaltech.com.pe',
    user:'movil_admin',
    password:'mesfebrero2023',
    database:'movil_arellano',
    port: 3306

  });

  //return db_con;

//}

db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("connected to Database");
  }
});

app.use(express.json())
app.set("view engine", "ejs");
app.use('/public', express.static(__dirname + '/public' ));

app.use(express.static('public'));

app.use(cors());



app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  next();
})

//app.use(app.router);

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

io.on("connection", function (socket) {
  console.log(`User connected: ${socket.id}`);
  socket.on("send-location", function (data) {
    console.log(
      `Location received from ${socket.id}: ${data.latitude}, ${data.longitude}`
    );
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    console.log(`User disconnected: ${socket.id}`);
    io.emit("user-disconnected", socket.id);
  });

  // Escuchar el cliente
  socket.on('refreshlocation', (data, callback) => {

    //console.log(data);

    //console.log('refreshlocation'+data.id);

    socket.broadcast.emit('refreshlocation', data);

    //socket.broadcast.emit('refreshlocation0008', data);




    // if (mensaje.usuario) {
    //     callback({
    //         resp: 'TODO SALIO BIEN!'
    //     });

    // } else {
    //     callback({
    //         resp: 'TODO SALIO MAL!!!!!!!!'
    //     });
    // }



  });
});

//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, "js")))
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function (req, res) {
  //req.params.email
  res.render("index");
});

app.get('/vermapa',function (req, res) {
  //req.params.email
  res.render('vermap');
});



app.post('/getlistado',urlencodedParser,function(req,res){

  //const objBD = db_con;

  db_con = mysql.createConnection({
    host:'globaltech.com.pe',
    user:req.body.c_usu,
    password:req.body.c_cla,
    database:req.body.c_bd,
    port: 3306

  });

  db_con.query("SELECT a.RS as Nombre, a.Direccion,0 as Lim_Cred ,ifnull(concat(DATE_FORMAT(p.FDoc, '%d-%m-%Y'),' ',SUBSTRING(p.FReg, 11)),'') as Fecha, "+
      " ifnull(p.ImpTot, 0) as ImpTot,'0.00' as TotalCob, ifnull(a.Lat,'') as lat,ifnull(a.Lng,'') as lng, "+
      " CASE WHEN a.lat <> '' or a.lng <> '' THEN 1 ELSE 0 END AS Coord, cast(ra.nOrden as int) nOrden, case when ifnull(p.Anx_Id,'')='' then 0 else 1 end as nPuntero "+
      "from rutas r inner join rutas_anx ra on r.Ruta_Id=ra.Ruta_Id inner join rutas_prg g on r.Ruta_Id=g.Ruta_Id inner join anx a on ra.Anx_Id=a.Anx_Id "+
      " left outer join ( select p.anx_id,p.suc_id,p.cia,p.FDoc,p.FReg,p.ImpTot from ped p where p.TD='"+ req.body.td +"' and p.Cia= '"+ req.body.cia +"' and p.FDoc = '"+ req.body.fdoc +"' and p.Pers_Id= '"+ req.body.pers_id +"' ) p "+
      " on a.Anx_Id=p.Anx_Id where g.Pers_Id= '"+ req.body.pers_id +"' and (g.DV=(DAYOFWEEK('"+ req.body.fdoc +"') + 5) % 7 + 1) and (r.Cia= '"+ req.body.cia +"' or r.Cia='') and a.Lat<>'' " +
      " and a.Lng<>'' order by ra.nOrden ;",function (error,resultado,fila){


    if(!error){
      //console.log(resultado);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
      res.setHeader("Access-Control-Max-Age", "3600");
      res.setHeader("Access-Control-Allow-Headers", "x-requested-with");

      return  res.send(resultado);

    }else{
      return  res.send({status: -1});
    }

    res.end();

  });

});


server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
