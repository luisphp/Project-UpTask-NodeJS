"use strict"

const express = require('express')
const router = express.Router();

//Importar express-validator
const {body} = require('express-validator')

//Importar controlador de proyectos
const proyectosController = require('../controllers/proyectosController')

// Importar controlador de tareas
const tareasController = require('../controllers/tareasController')


module.exports = function () {

    /* RUTAS para los Proyectos  */

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

    // Actualizar el proyecto
    router.get('/proyecto/editar/:id' , proyectosController.formularioEditar)

    // Actualizar el proyecto
    router.get('/proyecto/editar/:id' , proyectosController.formularioEditar)

    //Update a project
    router.post('/new-project/:id', body('name').not().isEmpty().trim().escape(), proyectosController.UpdateAProject)

    //Eliminar proyecto
    router.delete('/proyecto/:url' , proyectosController.eliminarProyecto)

    /*********  RUTAS para las Tareas  **********/

    // Guardar una nueva tarea
    router.post('/proyecto/:url' , tareasController.agregarTarea)
    
    // Actualizar el estado de una tarea
    router.patch('/tarea/:id' , tareasController.updateTarea)

    // Eliminar una tarea
    router.delete('/tarea/:id' , tareasController.deleteTarea)

    











        // **************** Salesforce **************** //

        // get Salesforce Credencial - Salesforce
        router.get('/api/salesforceConnection', proyectosController.makeSalesforceConnect)

        // get Salesforce Products - Salesforce
        router.post('/api/getAllSalesforceProducts', proyectosController.getAllSalesforceProducts)

        // post createOrder - Salesforce
        router.post('/api/postNewSalesforceOrder', proyectosController.postNewSalesforceOrder)
    
        // Ruta B2C de pruebas
        router.post('/api/b2c/pruebasinglesignnone', proyectosController.b2cprueba)
    
    
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

