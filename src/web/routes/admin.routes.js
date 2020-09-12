const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/dashboard',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        res.render('admin/dashboard', usuario);
    }else{
        res.render('index');
    }
});

router.post('/admin/login',(req,res)=>{
    let script = "select u.cedula, u.nombre, u.apellido, u.usuario, a.rol "+
    "from t_usuario u "+
    "inner join t_administrativo a "+
    "on a.usuario = u.id "+
    "where u.cedula = ?" +
    "and u.clave = sha1(?)";

    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
            console.log(rows);
        if(rows != undefined){
            if(rows[0].rol == 2){
                req.session.value = rows[0];
                res.redirect('/admin/dashboard');
            }else{
                res.render('index',{err:'1',id: req.body.cedula});
            }
        }else{
            res.render('index',{err:'2',id: req.body.cedula});
        }
    });
});
module.exports = router;


