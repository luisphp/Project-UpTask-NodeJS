const Proyectos = require('../models/Proyectos')
const slug = require('slug');
const { response } = require('express');
const axios = require('axios');
const FormData = require('form-data');


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

exports.proyectoPorUrl = async(req,res) => {

    let allProjects = await Proyectos.findAll()

    let proyectoOne = await Proyectos.findOne({
            where : {
                url : req.params ? req.params.url : 'Nada'
            }
        })

        !proyectoOne ? proyectoOne = {message: 'Item not found'} : ''

        res.render('ProjectTasks',{
            proyectoOne,
            nombrePagina: 'Tareas del proyecto: ' ,
            allProjects
        })
}
    // Apartado de las APIS

    //Obtener todos los proyectos
    exports.apiGetAllProjects = async(req, res) => {
        //Hacemos la consulta a la base de datos
        const allProjects = await Proyectos.findAll();

        if(allProjects.length === 0){
            allProjects = {}
        }

        // console.log('Todos los proyectos: ',allProjects)
        res.json(allProjects)
    }

    //Guardar un project
    exports.apiSaveNewProject = (req, res) => {
        
        //Validar que tengamos algo en el input
        const {name} = req.body

        let errores = [];

        name ? '' : errores.push({'message': 'Please add a name to your Project'})

        if(errores.length > 0) {
            res.status(200).json(errores)
        } else {
            const proyecto = Proyectos.create({name})
            res.status(200).json({message: 'Project saved'})
        }
    }

    // Obtener un proyecto en especifico
    exports.apiGetSpecificProject = async (req,res) => {
        try {
        let selectedProject = req.params.projectId
        const result = await Proyectos.findAll({
            where: {
                id: selectedProject
              }
            });
        
            res.json({"projectId Received"  : req.params.projectId, result});
        } catch (error) {
            console.log('Error al obtener el proyecto', error)
            res.status(404).json({message: 'Project not found'})
        }
        
    }

    exports.apiUpdateProject = async (req,res) => {

        //Validar que tengamos algo en el input
        const {name} = req.body
        const selectedProject = req.params.projectId

        let errores = [];

        name ? '' : errores.push({'message': 'Please add a name to your Project'})

        if(errores.length > 0) {
            res.status(200).json(errores)
        } else {
            Proyectos.update(
                { name },
                { where: { 
                    id: selectedProject 
                    } 
                }
            )
                .then(result =>
                console.log('Project updated, message', result)
                )
                .catch(err =>
                    console.log('Project updated failed, message', err)
                )
            res.status(200).json({message: 'Project updated'})
        }
    }

    exports.apiDeleteProject = (req,res) => {
            const selectedProject = req.params.projectId  

        Proyectos.destroy({
            where: {
                id: selectedProject
            }
        })
        .then(result => {
            console.log('Project Deleted: ', result)
            res.json({message: 'Project deleted'})
        })
        .catch(err => {
            console.log('Error on delete method : ', err)
            res.json({message: 'Failed on delete'})
        })
    }

    // **** Salesforce ****
    
    //Hacer request a Salesforce Auth
    exports.makeSalesforceConnect = async (req, res, next) => {

        const formData = new URLSearchParams();
        formData.append('username', 'oneillvilla@brave-otter-7n2baa.com')
        formData.append('password', '##123Labs***SPbcGzwiXNqTXKjH8vqIi0fG')
        formData.append('grant_type', 'password')
        formData.append('client_secret', 'B7CF14D7C45753E9AFCD2332E54F0696C7F7574E7463FEA7B1D9D77E122F4214')
        formData.append('client_id', '3MVG9cHH2bfKACZa.edll4621R8GebXFY1BxtlvAWjJSDql3iy2UmvycgxH8wwGjcAjXz2IQVzy2cFErnet32',)

        const responseServer = await axios.request({
        url: 'https://login.salesforce.com/services/oauth2/token',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: formData
        }).then(function (response) {

            console.dir(req.hostname)

            // console.log('Todo ok: ', response.data);
            var credencial = response.data
            
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.status(200).json({message: 'Ya puedes hacer request a Salesforce Auth', credencial })
            next()
        })
        .catch(function (error) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            
            var ServerError = ''
            res.status(200).json({message: 'No se pudo enviar el request[Auth]' })
        });
    }

    //makeSalesforceAuth = async (req, res, next) => {
    async function makeSalesforceAuth () {
        
        const formData = new URLSearchParams();
        formData.append('username', 'oneillvilla@brave-otter-7n2baa.com')
        formData.append('password', '##123Labs***SPbcGzwiXNqTXKjH8vqIi0fG')
        formData.append('grant_type', 'password')
        formData.append('client_secret', 'B7CF14D7C45753E9AFCD2332E54F0696C7F7574E7463FEA7B1D9D77E122F4214')
        formData.append('client_id', '3MVG9cHH2bfKACZa.edll4621R8GebXFY1BxtlvAWjJSDql3iy2UmvycgxH8wwGjcAjXz2IQVzy2cFErnet32',)

        const responseServer = await axios.request({
        url: 'https://login.salesforce.com/services/oauth2/token',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: formData
        }).then(function (response) {
                //access_token = response.data.access_token
                //console.log('result nueva forma: [success]', response.data.access_token)
                return response.data.access_token
            })
                .catch( function (error) {
                    //console.log('nueva forma[error]: ',error)
                console.log('result nueva forma: [failed]', error)
            });

        // return access_token;
        return responseServer
    }

    //Hacer request a Salesforce Auth
    exports.getAllSalesforceProducts = async (req, res, next) => {

        //***Extraemos el access_token del request
        //
        //*     const {access_token} = req.body
        //*     console.log('[getProducts]: ', req.body) 
        //
        //***no necesario en este momento

        var access_token =  await makeSalesforceAuth()

        const responseServer = await axios.request({
        url: 'https://brave-otter-7n2baa-dev-ed.my.salesforce.com/services/apexrest/api/products',
        method: 'GET',
        headers: {'Authorization': 'Bearer '+access_token}
        }).then(function (response) {

            axios.req
            var AllProducts = response.data
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.status(200).json({message: 'Todos los productos', AllProducts })
            next()
        })
        .catch(function (error) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            var ServerError = error.data
            //console.log(error.data)
            res.status(200).json({message: 'No se pudo enviar el request [getAllProducts]', error })
        });

        // axios.interceptors.request.use(request => {
        //     console.log('Starting Request', JSON.stringify(request, null, 2))
        //     return request
        //   })
    }