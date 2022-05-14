"use strict"
// Main file
const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')


//Importamos todos nuestros helpers
const helpers = require('./helpers')

// Crear la conexion a la base de datos
const db  = require('./config/db')

//Importar el modelo
require('./models/Proyectos')

// db.authenticate()
/*db.sync()
    .then(() => console.log('Conectado al servidor de base de datos Xampp: localhost/phpmyadmin '))
    .catch(error => console.log('No se puedo conectar al servidor de base de datos: ', error))*/

//Crear un app/servidor de express
const app = express()


//Cargar archivos estaticos / como estilos CSS y javscript en este caso estan en public
app.use(express.static('public'))

//Habilitar pug
app.set('view engine', 'pug')

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

/* --**MIDDELWARES**-- */

// Pasar varDump a la aplicacion --> Este es el primer middleware
app.use((req, resp, next) => {
    
    resp.locals.year = 2019

    //Este es un customHelper 
    resp.locals.varDump = helpers.varDump
    next()
})


// Usando un segundo middleware sencillo
app.use((req,res,next) => {
    console.log('\x1b[33m%s\x1b[0m','Ejecutando segundo middleware')
    next()
})


// //Usando un tercer middleware sencillo
// app.use((req,res,next) => {
//     console.log('\x1b[33m%s\x1b[0m','Ejecutando tercer middleware')
//     next()
// })


//habilitar body parser para tener acceso a lo que se mande como "POST" ya sea form/Http request
app.use(bodyParser.json());
require('body-parser-xml')(bodyParser);
app.use(
  bodyParser.xml({
    limit: '1MB', // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true, // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false, // Only put nodes in array if >1
    },
  }),
);
app.use(bodyParser.urlencoded({extended: true}))
app.use( '/' , routes() )

var port = process.env.PORT || 5000

app.listen(port, (error) => {
    if(error) {
        console.log('Error starting server: ',error)
    }else{
        console.log('Server is running on localhost:5000')
    }
})