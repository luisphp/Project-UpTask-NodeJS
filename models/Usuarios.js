const Sequelize  = require('sequelize')
const db  = require('../config/db')
// const slug = require('slug')
// const shortid = require('shortid')
const Proyectos = require('./Proyectos')
const Tares = require('./Tareas')
const bcrypt = require('bcrypt-nodejs')

const Usuario = db.define('usuarios' , {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true

    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate(usuario){
            // console.log('tu ususario es: ' , usuario.password)
            usuario.password = bcrypt.hashSync( usuario.password, bcrypt.genSaltSync(10))
        }
    }
})

Usuario.hasMany(Proyectos)

module.exports = Usuario;


