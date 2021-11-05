"use strict"

const express = require('express')
const router = express.Router();

//Importar controldor
const proyectosController = require('../controllers/proyectosController')


module.exports = function () {
    router.get('/',proyectosController.proyectosHome )

    router.get('/about', proyectosController.proyectosAbout)

    return router   
}

