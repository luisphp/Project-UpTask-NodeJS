const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');
const { response } = require('express');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');
const { Console } = require('console');

// Metodo para guardar una tarea asociada a un proyecto
// la tarea viene en un form input y el key seria la slug-URL del proyecto
exports.agregarTarea = async (req, res, next) => {

    // Primero obtnenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url : req.params.url
        }
    });

    // Segundo definimos lo que va a ser el guardado del nuevo registro en las tareas
    const {tarea} = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;

    // Ahora hacemos la insercion del nuevo registro de tarea en la base de datos
    const resultado = await Tareas.create({tarea, estado, proyectoId})

    if(!resultado) {
        next();
    }

    res.redirect(`/proyectos/${req.params.url}`)
}

// Metodo para actualizar el estado de una tarea
exports.updateTarea = async (req, res, next) => {

    //console.log('\x1b[36m%s\x1b[0m', 'Se recibio el estado >>> ' ,req.params);

    const {id} = req.params;

    const tarea = await Tareas.findOne({
        where: {
            id
        }
    });

    if(!tarea) {return next();}

    let estado = 0;

    if(tarea.estado == 0){
        estado = 1;
    }

    tarea.estado = estado;

    const response = await tarea.save();

    if(!response) {return next();}

    //console.log("\x1b[41m", 'Tarea encontrada \n',tarea)

    res.status(200).json({message: 'estado actualizado' , response});
}

exports.deleteTarea = async (req, res, next) => {

    console.log("\x1b[43m", 'Tarea a eliminar ', req.query)
    const {idTarea}  = req.query;

    const response = await Tareas.destroy({where:{
        id : idTarea
    }});

    if(!response) { return next();}

    res.status(200).json({message: 'Borrando la tarea' , operation: response});

}
