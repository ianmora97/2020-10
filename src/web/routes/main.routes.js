const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/registrarse',(req,res)=>{
    res.render('client/registrarse');
});

router.post('/profesores',(req,res)=>{
    var script = con.query('select * from t_profesor',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});
module.exports = router;


