const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Conta")
const Conta = mongoose.model("contas")
require("../models/GrupoConta")
const GrupoConta = mongoose.model("grupos_contas")
const {logado} = require("../helpers/logado")


function validaFormularioContas(req){
    erros = []
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null)
      erros.push({texto: "descrição inválido."});
    if(req.body.descricao.length < 6)
      erros.push({texto: "Descrição deve ter no mínimo 6 caracteres."});
    if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null)
        erros.push({texto: "valor inválido."});
    return erros;
}


router.get('/', logado, (req, res)=>{
    Conta.find().populate("grupos_contas").then((contas)=>{
        res.render('contas/index', {contas: contas}) 
      }).catch((err)=>{
          console.log('erro ao tentar abrir lista de contas. ' + err);
          req.flash("error_msg", "Houve um erro interno.");
          res.redirect("/");       
      })
   
})

router.get('/novo', logado, (req, res)=>{
    GrupoConta.find({usuario: req.user.id}).then((gruposContas)=>{
        res.render('contas/addConta', {gruposContas: gruposContas});  
      }).catch((err)=>{
          console.log('erro ao tentar abrir grupos de contas. ' + err);
          req.flash("error_msg", "Houve um erro interno.");
          res.redirect("/");       
      })
})


router.post('/novo', logado, (req, res)=>{
    erros = []
    erros = validaFormularioContas(req)
    if(erros.length > 0){
        res.render('contas/addConta', {erros: erros});
    }
    else{
        var novaConta = new Conta({
            descricao: req.body.descricao,
            valor: req.body.valor,
            vencimento: req.body.vencimento,
            grupoConta: req.body.grupoConta,
            status: req.body.status
        })

        if(req.body.status === "QUITADO")
            novaConta.pagamento = Date.now();

        novaConta.save().then(()=>{
            req.flash("success_msg", "Conta criado com sucesso.");
            res.redirect("/contas");
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao tenta salvar um conta");
            console.log('Erros: ' + err);
            res.redirect("/contas/novo");
        })
    }  
})

/*router.post('/editar', logado, (req, res)=>{
    erros = []
    erros = validaFormularioContas(req)
    if(erros.length > 0){
        res.render('gruposContas/editGrupoConta', {erros: erros});
    }
    else{
        GrupoConta.findOne({_id: req.body.id}).then((grupoConta)=>{    
        grupoConta.descricao =  req.body.descricao;
        grupoConta.usuario =  req.user.id;
        grupoConta.id = req.body.id;
        grupoConta.tipo = req.body.tipo;
        grupoConta.save().then(()=>{
            req.flash("success_msg", "Grupo de conta editado com sucesso.");
            res.redirect("/grupos-contas");
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao tenta salvar um grupo de conta");
            console.log('Erros: ' + err);
            res.redirect("/grupos-contas/novo");
        })
        }).catch((err)=>{
            console.log('erro ao tentar abrir grupos de contas. ' + err);
            req.flash("error_msg", "Houve um erro interno.");
            res.redirect("/");       
        })   
    
    }  
})*/
module.exports = router;