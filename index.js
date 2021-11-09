"use strict"
// Main file
const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')

//Crear un app/servidor de express
const app = express()

//Cargar archivos estaticos / como estilos CSS y javscript en este caso estan en public
app.use(express.static('public'))

//Habilitar pug
app.set('view engine', 'pug')

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'))

//habilitar body parser para tener acceso a lo que se mande como "POST" ya sea form/Http request
app.use(bodyParser.urlencoded({extended: true}))
app.use( '/' , routes() )

app.listen(5000)
