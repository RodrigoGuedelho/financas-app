const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/GrupoConta")
const GrupoConta = mongoose.model("grupos_contas")
const {logado} = require("../helpers/logado")


function validaFormularioRegistro(req){
    erros = []
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null)
      erros.push({texto: "descrição inválido."});
    if(req.body.descricao.length < 6)
      erros.push({texto: "Descrição deve ter no mínimo 6 caracteres."});
    return erros;
}

router.get('/', logado, (req, res)=>{
    GrupoConta.find({usuario: req.user.id}).then((gruposContas)=>{
      res.render('gruposContas/index', {gruposContas: gruposContas});  
    }).catch((err)=>{
        console.log('erro ao tentar abrir grupos de contas. ' + err);
        req.flash("error_msg", "Houve um erro interno.");
        res.redirect("/");       
    })
})
router.get('/novo', logado, (req, res)=>{
    res.render('gruposContas/addGrupoConta');  
})
router.get('/editar/:id', logado, (req, res)=>{
    GrupoConta.findOne({_id: req.params.id, usuario: req.user.id}).then((grupoConta)=>{
        if(grupoConta)
            res.render('gruposContas/editGrupoConta', {grupoConta: grupoConta});
        else{
            req.flash("error_msg", "Grupo de contas não existe.");
            res.redirect("/");         
        }
      }).catch((err)=>{
          console.log('erro ao tentar abrir grupos de contas. ' + err);
          req.flash("error_msg", "Houve um erro interno.");
          res.redirect("/");       
      })  
})


router.post('/novo', logado, (req, res)=>{
    erros = []
    erros = validaFormularioRegistro(req)
    if(erros.length > 0){
        res.render('gruposContas/addGrupoConta', {erros: erros});
    }
    else{
        var novoGrupoConta = new GrupoConta({
            descricao: req.body.descricao,
            usuario: req.user.id,
            tipo: req.body.tipo
        })
        novoGrupoConta.save().then(()=>{
            req.flash("success_msg", "Grupo de conta criado com sucesso.");
            res.redirect("/grupos-contas");
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao tenta salvar um grupo de conta");
            console.log('Erros: ' + err);
            res.redirect("/grupos-contas/novo");
        })
    }  
})

router.post('/editar', logado, (req, res)=>{
    erros = []
    erros = validaFormularioRegistro(req)
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
})

router.post("/deletar", logado, (req, res)=>{
    GrupoConta.remove({_id: req.body.id}).then((grupoConta)=>{      
        req.flash("success_msg", "grupo de conta deletado com sucesso.")
        res.redirect("/grupos-contas")  
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao deleta postagem. " + err)
        res.redirect("/grupos-contas")
    })
});
module.exports = router;