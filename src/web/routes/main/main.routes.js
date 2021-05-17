/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro
    * 
    * Main routes are the manager for the main path /
*/

const express = require('express');
const router = express.Router();

const con = require('../../database');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/prueba', (req, res) => {
    let usuario = req.session.value;

        let v = { usuario, selected: 'home' }
        res.render('client/perfil/lo_que_voy_a_probar',v);
    });


router.get('/pruebaImage', (req, res) => {
    res.render('pruebaImage');
});

router.get('/admin', (req, res) => {
    res.render('indexAdmin');
});

router.get('/profesores', (req, res) => {
    res.render('indexProfesores');
});

router.get('/registrarse', (req, res) => {
    res.render('client/registrarse');
});

router.get('/perfil', (req, res) => {
    res.render('client/perfil');
});

router.get('/contactarAdministrador',(req,res)=>{
    res.render('client/perfil');
});

module.exports = router;

