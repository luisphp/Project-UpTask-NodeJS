"use strict"

const express = require('express')
const router = express.Router();

//Importar express-validator
const {body} = require('express-validator/check')

//Importar controldor
const proyectosController = require('../controllers/proyectosController')


module.exports = function () {
    //Show index
    router.get('/',proyectosController.proyectosHome )

    //Shoe about page
    router.get('/about', proyectosController.proyectosAbout)

    //Show new Project form
    router.get('/new-project', proyectosController.proyectosNew)
    
    //Save the new project "POST"
    router.post('/new-project', 
    
                body('name').not().isEmpty().trim().escape(), 
                //Aqui ya estamos validando lo que viene de imput con express-validator
                
                proyectosController.CreateNewProject)

    return router   
}

