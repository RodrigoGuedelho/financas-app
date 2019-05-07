//Carregando módulos    
const express = require("express");

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const usuario = require("./routes/usuario");
const grupoConta = require('./routes/grupoConta');
const conta = require('./routes/conta')
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport")
require("./config/auth")(passport)

//Configurações
    //Sessão
        app.use(session({
            secret: "QuantoMaisDificilMelhor",
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash());

    //middleware
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next();
        })
    // bory parsers
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // handlebars template engine
		app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/financas-app').then(()=>{
            console.log("conectado ao mongoDB.");
        }).catch((err)=>{
            console.log("Erro ao tenta se conectar ao mongoDB. " + err);
        })
    //public - arquivos static
        app.use(express.static(path.join(__dirname, "public")));
//Rotas  
    app.use('/grupos-contas',grupoConta)
    app.use('/usuarios', usuario)
    app.use('/contas', conta)

    app.get('/', (( req, res)=>{
        if(req.isAuthenticated())
            res.render("index")
        else {
            res.redirect('/usuarios/login')  
        }   
    }));
   

    app.get('/404', (( req, res)=>{
        res.send("Erro 404!")
    }));

//Outros

const PORT = process.env.PORT || 8089;
app.listen(PORT, function () {
	console.log("Servidor rodando na url http://localhost:8089");
});
