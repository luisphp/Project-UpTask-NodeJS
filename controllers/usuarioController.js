
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const Usuarios = require('../models/Usuarios');
const slug = require('slug');
const { response } = require('express');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');
const { Console } = require('console');

    exports.formularioCrearCuenta = async (req, res) => {
        
        res.render('crearCuenta', {
            nombrePagina: 'Crear cuenta en Uptask'
        })
    }

    exports.crearCuenta = async (req, res, next) => {

        //Leer el request
        const {email,password} = req.body

            Usuarios.create({
                email,
                password
            })
            .then(() => {
                res.redirect('/iniciar-sesion')
            }).
            catch((e) => {
                res.send({message: e})
            })

            // res.send({message: 'Todo ok', usuarioCreado})




    
        
        
    }


