const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const router = express.Router();

const con = require('../database');
const email = require('../email');



//selecciona todos los estudiantes
router.get('/estudiantes',(req,res)=>{
	console.log(req);
    var script = con.query('select * from t_estudiante',
    (err,rows,fields)=>{
        res.send(rows);
    });
});

//actualizar datos de estudiante
router.put('/client/actualizardatos',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let q = req.body;
        var script = con.query('call prc_actualizar_datos_cliente_estudiante(?,?,?,?,?,?,?,?,?,?)',
        [q.cedula, q.correo, q.celular, q.telefono, q.emergencia, q.carrera, q.provincia, q.canton, q.distrito, q.direccion],
        (err,rows,fields)=>{
            if(!err){
                if(rows != undefined){
                    let script = "select * from vta_cliente_estudiante where cedula = ? ";
                    var query = con.query(script,
                    [q.cedula], (err,row,fields)=>{
                        if(!err){
                            if(row != undefined){
                                req.session.value = row[0];
                                res.send(row[0]);
                            }else{
                                res.render('index',{err:'1',id: req.body.cedula});
                            }
                        }else{
                            res.render('index',{err:'2',id: req.body.cedula});
                        }
                    });
                }
            }
        });
    }else{
        res.render('index',{err:'sessionExpired'});
    }
});

//Actualiza estado de consentimiento
router.put('/estudiantes/actualizarConsentimiento',(req,res)=>{
    var script = 'prc_actualizar_consentimiento_estudiante( ? , ? )';
    con.query(script, [req.body.cedula , req.body.consentimiento] ,
    (err,result,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(result);
            }
        }
    });
});


//vista de estudiantes para administradores
router.get('/admin/estudiantesAdmin',(req,res)=>{
    var script = con.query('select * from vta_admin_estudiante',
    (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }
    });
});

//vista de estudiantes para los clientes
router.get('/estudiantesClient',(req,res)=>{
    var script = con.query('select * from vta_cliente_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de documentos subidos por el estudiante
router.get('/estudiante/documentos',(req,res)=>{
    var script = con.query('select * from vta_documento_estudiante',(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula
router.get('/estudianteCedula',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula( ? )',[req.cedula],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula para el administrador
router.get('/estudianteCedulaAdmin',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula_admin( ? )',[req.cedula],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});
//cargar los documentos de prescripcion medica
router.get('/client/cargarPadecimientosFotos',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        var script = con.query('call prc_seleccionar_documentos_usuario_por_cedula(?)',
        [usuario.cedula],(err,rows,fields)=>{
            if(!err){
                if(rows[0] != undefined){
                    res.send(rows[0]);
                }
            }
        });
    }else{
        res.render('index');
    }
});

//Muestra los Estudiantes
router.post('/admin/usuarios/estudiantes',(req,res)=>{
    
    var script = con.query('call prc_insertar_estudiante(?, ?)', 
    [req.query.departamento,req.query.usuario],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});

//Inserta Estudiante
router.post('/estudiante/insertar',(req,res)=>{
    
    var script = con.query('call prc_insertar_estudiante(?, ?)', 
    [req.query.departamento,req.query.usuario],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});



router.post('/client/uploadImage', (req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'perfil'}
        var script = con.query('call prc_actualizar_foto_usuario(?, ?)',
        [req.session.value.cedula,req.file.filename],(err,rows,fields)=>{
            if(!err){
                let script = "select * from vta_cliente_estudiante where cedula = ? ";
                var query = con.query(script,
                [usuario.cedula], (er,row,fields)=>{
                    if(!er){
                        if(row != undefined){
                            req.session.value = row[0];
                            res.render('client/perfil/perfil',v);
                        }else{
                            res.render('index',{err:'1',id: req.body.cedula});
                        }
                    }else{
                        res.render('index',{err:'2',id: req.body.cedula});
                    }
                });
            }else{
                res.render('client/perfil/perfil',v);
            }
        });
    }else{
        res.render('index');
    }
    
});

module.exports = router;