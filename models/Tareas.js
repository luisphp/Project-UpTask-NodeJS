const Sequelize  = require('sequelize')
const db  = require('../config/db')
// const slug = require('slug')
// const shortid = require('shortid')
const Proyectos = require('./Proyectos')

const Tareas = db.define('tareas', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: {
        type: Sequelize.STRING,
        allowNull: false
    },
    estado: {
        type: Sequelize.INTEGER,
        allowNull: true
    }

}, {
    //Hook para realizar acciones antes de insertar en la base de datos
    hooks: {
        beforeCreate(tarea){
            // const url = slug(proyecto.name).toLowerCase();
            // proyecto.url = `${url}-${shortid.generate()}`
            console.log('Se ejecuta el hook beforeCreate para el slug')
            // console.log('Antes de insertar en la base de datos ', proyecto.name)
            // console.log('Antes de insertar en la base de datos ', proyecto.url)
        },
        beforeUpdate(tarea){
            // const url = slug(proyecto.name).toLowerCase();
            // proyecto.url = `${url}-${shortid.generate()}`
            // console.log('Se ejecuta el hook beforeUpdate para el slug')
        }
    }
})

Tareas.belongsTo(Proyectos)

module.exports = Tareas