const Sequelize  = require('sequelize')
const db  = require('../config/db')
const slug = require('slug')
const shortid = require('shortid')

const Proyectos = db.define('proyectos', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: true
    }

}, {
    //Hook para realizar acciones antes de insertar en la base de datos
    hooks: {
        beforeCreate(proyecto){
            const url = slug(proyecto.name).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`
            console.log('Se ejecuta el hook beforeCreate para el slug')
            // console.log('Antes de insertar en la base de datos ', proyecto.name)
            // console.log('Antes de insertar en la base de datos ', proyecto.url)
        }
    }
})

module.exports = Proyectos