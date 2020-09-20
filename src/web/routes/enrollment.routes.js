const express = require('express');
const router = express.Router();
const con = require('../database');

//Selecciona todas las matriculas
router.get('/matricula',(req,res)=>{
    var script = 'select * from vta_matriculados_por_grupo;';
    con.query(script,(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Selecciona matriculas de un estudiante en especifico
router.get('/matricula/seleccionaMatriculaEstudiante',(req,res)=>{
    const script = 'call prc_seleccionar_matricula_por_estudiante(?)'; 
    con.query(script,[req.body.id],(err,rows,fields)=>{
        if(err) throw err;
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Inserta una matricula
router.post('/matricula/insertar',(req,res)=>{
    var script = 'call prc_insertar_matricula( ? , ? , ? )';
    con.query(script,[req.body.grupo, req.body.estudiante,req.body.consentimiento],
        (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }else{
            console.log(err.message);
        }
    });
});


module.exports = router;


