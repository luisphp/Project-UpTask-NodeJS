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
exports.CreateNewProject = (req, res) => {
    // console.log(req.body)
    
    //validar que tengamos algo en el input
    const {name} = req.body

    let errores = [];

    name ? '' : errores.push({'message': 'Please add a name to your Project'})

    errores.length > 0 ? res.render('newProject', { nombrePagina: 'New Project' ,errores}) : ''

}