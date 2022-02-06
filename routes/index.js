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

    //Show about page
    router.get('/about', proyectosController.proyectosAbout)

    //Show new Project form
    router.get('/new-project', proyectosController.proyectosNew)
    
    //Save the new project "POST"
    router.post('/new-project', 
    
    body('name').not().isEmpty().trim().escape(), 
    //Aqui ya estamos validando lo que viene de input con express-validator
    
    proyectosController.CreateNewProject)

    //Listar proyecto (PUG)
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl)

    // *** Salesforce ****

    // get Salesforce Credencial 
    router.get('/api/salesforceConnection', proyectosController.makeSalesforceConnect)

    // get Salesforce Products
    router.post('/api/getAllSalesforceProducts', proyectosController.getAllSalesforceProducts)
    
    
    
    
    //Apartado de las APIS ---GenXD

        //Get All projects
        router.get('/api/allProjects', proyectosController.apiGetAllProjects)

        //Save a new Project
        router.post('/api/saveNewProject', proyectosController.apiSaveNewProject)

        // Get specific project
        router.get('/api/project/:projectId', proyectosController.apiGetSpecificProject)

        // Update Specific project
        router.post('/api/updateProject/:projectId', proyectosController.apiUpdateProject)

        // Delete Specific project
        router.delete('/api/deleteProject/:projectId', proyectosController.apiDeleteProject)

    return router
}

