const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')
const slug = require('slug');
const { response } = require('express');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');
const { Console } = require('console');


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

exports.proyectosNew = async (req, res) => {

    const allProjects = await Proyectos.findAll();

    res.render('newProject', {
        nombrePagina: 'New Project',
        allProjects
    })
}

// Save a new project using "POST"
exports.CreateNewProject = async (req, res) => {
    // console.log(req.body)
    const allProjects = await Proyectos.findAll();
    
    //validar que tengamos algo en el input
    const {name} = req.body

    let errores = [];

    name ? '' : errores.push({'message': 'Please add a name to your Project'})

    if(errores.length > 0) {
        res.render('newProject', { nombrePagina: 'New Project' ,errores, allProjects})
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


// Update a new Project
exports.UpdateAProject = async (req, res) => {
    // console.log(req.body)
    const allProjects = await Proyectos.findAll();
    
    //validar que tengamos algo en el input
    const {name} = req.body

    let errores = [];

    name ? '' : errores.push({'message': 'Please add a name to your Project'})

    if(errores.length > 0) {
        res.render('newProject', { nombrePagina: 'New Project' ,errores, allProjects})
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
        const proyecto = await Proyectos.update(
            {
                name : name
            },
            {
                where : {
                    id : req.params.id
                }
            });
            
        res.redirect('/')
    }
}

// exports.proyectoPorUrl = async(req,res) => {

//     let allProjects = await Proyectos.findAll()

//     let proyectoOne = await Proyectos.findOne({
//             where : {
//                 url : req.params ? req.params.url : 'Nada'
//             }
//         })

//         !proyectoOne ? proyectoOne = {message: 'Item not found'} : ''

//         res.render('ProjectTasks',{
//             proyectoOne,
//             nombrePagina: 'Tareas del proyecto: ' ,
//             allProjects
//         })
// }

exports.proyectoPorUrl = async (req, res, next) => {

    //Debemos traer todos los proyectos por el sidebar
    const allProjects = await Proyectos.findAll();

    //Debemos traer el proyecto consultado en la URL
    const proyecto = await Proyectos.findOne({
        where: {
            url : req.params.url
        }
    });

    //Debemos consultar las tareas asociadas al proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        }
    })

    if(!proyecto) return next();

    //render a la vista
    res.render('tareas' , {
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        allProjects,
        tareas
    })
}


exports.formularioEditar = async (req, res, next) => {

    const allProjectsPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            id:req.params.id
        }
    });

    const [allProjects, proyecto] = await  Promise.all([allProjectsPromise,proyectoPromise]);
    
    res.render('newProject' , {
        nombrePagina : 'Edit Project',
        allProjects,
        proyecto
    });

}

// Metodo para eliminar un proyecto
exports.eliminarProyecto = async (req,res,next)  => {

    console.log('[ProyectoController-Delete] intentas eliminar: ' , req.query)

    const {urlProyecto} = req.query

    const resultado = await Proyectos.destroy({
        where: {
            url: urlProyecto
        }
    })

    if(!resultado){
        return next();
    }

    res.status(200).json({message : 'Proyecto Eliminado'})

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
        formData.append('password', '##123Labs****wZbkP6FaONeObiDH0uqvu0S2r')
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

    // Get Products From Salesforce
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

            // axios.req
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

    }

    // Post New Salesforce Order
    // URL : localhost:5000/api/postNewSalesforceOrder
    exports.postNewSalesforceOrder = async (req, res, next) => {

        var incomeBody =  req.body;
        console.log('REQUEST RECEIVED');
        JSON.stringify(req.body) == '{}' ? incomeBody = {"default_node" : "default_body_test"} : ''

        var orderDetails = {
            "accountId" : "0015e000003QRV6AAO",
            "orderItems" : [
            {
                "Id" : "01t5e000003kKf7AAE",
                "amount" : "300",
                "quantity" : "2"
            },
            {
                "Id" : "01t5e000003kKg0AAE",
                "amount" : "1250",
                "quantity" : "2"
            }],
            "shippingDetails" : "Addres 1 Test VueJS",
            "billingDetails" : "Billing Details 1 Test VueJS",
            "paymentMethod" : "CreditCard"
        }

        orderDetails.yourOrderDetails = req.body.orderDetails
        
        var access_token =  await makeSalesforceAuth()

        const responseServer = await axios.request({
        url: 'https://brave-otter-7n2baa-dev-ed.my.salesforce.com/services/apexrest/api/orders',
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+access_token},
        data : orderDetails
            }).then(function (response) {
            var orderInfo = response.data
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-Type' , 'application/json')
        
            // res.status(200).json({message: 'Your Order Has been received!!', orderInfo, salesforceResponse: response.data })
            res.status(200).json({Hello: 'Friend'})
            next();
            })
            .catch(function (error) {
                res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Credentials', true);
                res.setHeader('Content-Type' , 'application/json')
                console.log('Error postNewSalesforceOrder: [failed]', error)
                res.status(200).json({message: 'No se pudo enviar el request [postNewSalesforceOrder]', error })
            });
    }
    
    //var parseString = require('xml2js').parseString;
    

    exports.b2cprueba  = async (req, res, next) => {

        var body = req.body
        var UserName =  req.body['soapenv:envelope']['soapenv:body']['urn:authenticate']['urn:username']
        var Password =  req.body['soapenv:envelope']['soapenv:body']['urn:authenticate']['urn:password']
        var base64credentials = Buffer.from( UserName+':'+Password ).toString('base64')

        console.log( '>>>>>> UserName ', UserName , ' Password: ', Password )
        console.log('Base64 >>>> ', base64credentials)
        
        
        const responseServer = await axios.request({

            url: 'https://zycp-001.sandbox.us01.dx.commercecloud.salesforce.com/s/RefArch/dw/shop/v22_4/customers/auth?client_id=aa292ff4-311b-4304-93d7-329f2c17916a',
            method: 'POST',
            headers: {  'Authorization': 'Basic '+base64credentials,
                        'Content-Type' : 'application/json',
                        'Connection' : 'keep-alive',
                        'Accept' : 'application/json'},
            data: {
                type: 'credentials'
            }
            }).then(function (response) {
    
                var responseData = response.data
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Credentials', true);
                    var xmlResponse = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><ns2:AuthenticateResult xmlns:ns2="urn:authentication.soap.sforce.com"><ns2:Authenticated>true</ns2:Authenticated></ns2:AuthenticateResult></SOAP-ENV:Body></SOAP-ENV:Envelope>`
                    res.header('Content-Type', 'application/xml');
                    res.status(200).send(xmlResponse);
                next()
            })
            .catch(function (error) {

                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Credentials', true);

                var xmlResponse = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><ns2:AuthenticateResult xmlns:ns2="urn:authentication.soap.sforce.com"><ns2:Authenticated>false</ns2:Authenticated></ns2:AuthenticateResult></SOAP-ENV:Body></SOAP-ENV:Envelope>`
                res.header('Content-Type', 'application/xml');
                res.status(200).send(xmlResponse);

            });
    
    }

    /* Referencias de colores para mensajes de consola:

        console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
        console.log('\x1b[33m%s\x1b[0m', stringToMakeYellow);  //yellow
    
        Reset = "\x1b[0m"
        Bright = "\x1b[1m"
        Dim = "\x1b[2m"
        Underscore = "\x1b[4m"
        Blink = "\x1b[5m"
        Reverse = "\x1b[7m"
        Hidden = "\x1b[8m"

        FgBlack = "\x1b[30m"
        FgRed = "\x1b[31m"
        FgGreen = "\x1b[32m"
        FgYellow = "\x1b[33m"
        FgBlue = "\x1b[34m"
        FgMagenta = "\x1b[35m"
        FgCyan = "\x1b[36m"
        FgWhite = "\x1b[37m"

        BgBlack = "\x1b[40m"
        BgRed = "\x1b[41m"
        BgGreen = "\x1b[42m"
        BgYellow = "\x1b[43m"
        BgBlue = "\x1b[44m"
        BgMagenta = "\x1b[45m"
        BgCyan = "\x1b[46m"
        BgWhite = "\x1b[47m"
    
    
    */ 

