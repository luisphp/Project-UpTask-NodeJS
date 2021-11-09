const Proyectos = require('../models/Proyectos')

exports.proyectosHome = (req, res) => {
    res.render('index', {
        nombrePagina: 'Proyectos'
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
        const proyecto = await Proyectos.create({name})
        res.redirect('/')
    }

}