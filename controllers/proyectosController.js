const Proyectos = require('../models/Proyectos')
const slug = require('slug')

exports.proyectosHome = async (req, res) => {
    //hacemos la consulta a la base de datos
    const allProjects = await Proyectos.findAll();

    // console.log('Todos los proyectos: ',allProjects)
    res.render('index', {
        nombrePagina: 'Proyectos',
        allProjects // se pasan los projects a la vista
    })
}

exports.proyectosAbout = (req, res) => {
    res.render('about')
}

exports.proyectosNew = (req, res) => {
    res.render('newProject', {
        nombrePagina: 'New Project'
    })
}

// Save a new project using "POST"
exports.CreateNewProject = async (req, res) => {
    // console.log(req.body)
    
    //validar que tengamos algo en el input
    const {name} = req.body

    let errores = [];

    name ? '' : errores.push({'message': 'Please add a name to your Project'})

    if(errores.length > 0) {
        res.render('newProject', { nombrePagina: 'New Project' ,errores})
    } else {
        // Forma sincrona
        // Proyectos.create({name})
        // .then(() => {
        //     console.log(' Se inserto el proyecto correctamente')
        // })
        // .catch(error => {
        //     console.log('No se pudo insertar el registro: ', error)
        // })
        // res.render('newProject', {nombrePagina: 'New Project', })

        //****
        // Form asincrona
        // const url =  slug(name).toLowerCase()

        //Antes de guardar en la base de datos usamos el hook de sequelize para 
        const proyecto = await Proyectos.create({name})
        res.redirect('/')
    }

}