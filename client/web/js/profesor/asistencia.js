
var g_estudiantes = [];
var g_mapEstudiantes = new Map();

var g_grupos = [];
var g_informacionEstudiantes = [];
var g_mapGrupos = new Map();
var g_mapAsistencia = new Map();
var g_asistencia = [];

var g_grupoAbierto ='';
var g_grupoReposicion = [];

function loaded(event){
    events(event);
}

function events(event){
    traerEstudantesXGrupo();
    traerGrupos();
    bringEstudiantesInfo();
    movePageBack();
    modalsOpen();
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
const animateCSS = (element, animation) =>
    
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});
function modalsOpen() {
    $('#asistenciaModal').on('show.bs.modal', function (event) {
        animateCSS("#asistenciaModal", 'fadeInUpBig');
    })
    $('#asistenciaModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = $('#idGrupoTemp').html();
        var grupo = g_mapGrupos.get(parseInt(id));
        buildAsistenciaTable(grupo);
    })
    $('#asistenciaModal').on('hide.bs.modal', function (event) {
        let table = $('#tablaModalAsistencia').DataTable();
        table.destroy();
    })
}
function searchonfind(barra){
    let bar = $(barra);
    var table = $('#tablaModalAsistencia').DataTable();
    let val = bar.val();
    let result = table.search( val ).draw();
}
function borrarFecha() {
    let val = $('#datepicker').val('');
    var table = $('#tablaModalAsistencia').DataTable();         
    let result = table.search( '' ).draw();
}
function buscarFechaAsistencia() {
    let val = $('#datepicker').val();
    let fecha = moment(val,'DD/MM/YYYY hh').format('DD/MM/YYYY hh');
    var table = $('#tablaModalAsistencia').DataTable();         
    let result = table.search( fecha ).draw();
}

function buildAsistenciaTable(grupo) {
    let id = parseInt(grupo.id_grupo);
    $('#bodyTableModal').html('');
    g_asistencia.forEach((e)=>{
        if(e.id_grupo == id){
            let foto = '<img src="/public/uploads/'+e.foto+'" class="rounded-circle" width="30px" height="30px">';
            let fecha = moment(e.fecha).format('DD/MM/YYYY hh:mm');
            $('#bodyTableModal').append(`
            <tr>
                <td>${foto}</td>
                <td>${e.cedula}</td>
                <td>${e.nombre.toUpperCase() +' '+e.apellido.toUpperCase()}</td>
                <td>${moment(e.fecha,'DD-MM-YYYY-HH-mm').calendar()}</td>
                <td>
                    <h4><span class="w-100 badge badge-${e.estado == 'Presente' ? 'success' : e.estado == 'Tarde' ? 'warning' : 'danger'}">${e.estado}</span></h4>
                </td>
            </tr>
            `);
        }
    });
    $('#tablaModalAsistencia').DataTable({
        stateSave: true,
        "language": {
            "zeroRecords": "No se encontraron Asistencias para este grupo",
            "infoEmpty": "No hay registros disponibles!",
            "infoFiltered": "(filtrado de _MAX_ registros)",
            "lengthMenu": "_MENU_ ",
            "info": "Mostrando pagina _PAGE_ de _PAGES_",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": 'Primera',
                    "previous": 'Anterior',
                    "next": 'Siguiente',
                    "last": 'Última'
                }
            }
        }
    });
    $('#showlenghtentries').html('');
    $('#informacionTable').html('');
    $('#botonesCambiarTable').html('');
    $(`#tablaModalAsistencia_info`).appendTo(`#informacionTable`);
    $(`#tablaModalAsistencia_paginate`).appendTo(`#botonesCambiarTable`);
    $('#tablaModalAsistencia_length').find('select').removeClass('custom-select-sm');
    $('#tablaModalAsistencia_length').find('select') .appendTo(`#showlenghtentries`);
    $('#tablaModalAsistencia_filter').html('');
}

// ? ----------------------------------- TABLA MODAL ---------------------------------------
// ! ---------------------------------------------------------------------------------------


function movePageBack() {
    $('#pag_ant').on('click',function(){
        let page = $('#pag_ant').attr('data-page');
        $('#buttonTriggerModalAsistencia').hide();
        if(page == 1){
            $('#breadcrum-item-listaestudiantes').hide();
            $('#pag_ant').attr('data-page','0');
            $('#pag_ant').hide();
            $('#EstudiantesPorClaseLista').removeClass('animate__bounceInRight');
            $('#EstudiantesPorClaseLista').addClass('animate__bounceOutRight');
            setTimeout(()=>{
                $('#EstudiantesPorClaseLista').hide();
            },500);
            setTimeout(()=>{
                $('#listaFiltarClases').show();
                $('#clasesLista').show();
                $('#clasesLista').removeClass('animate__bounceOutLeft');
                $('#clasesLista').addClass('animate__bounceInLeft');
            },500);
        }
        if(page == 2){
            $('#breadcrum-item-estudiantesInfo').hide();
            $('#pag_ant').attr('data-page','1');
            $('#EstudiantesPorClaseLista').removeClass('animate__bounceInLeft');
            $('#EstudiantesPorClaseLista').removeClass('animate__bounceInRight');
            $('#estudianteInformacionLista').removeClass('animate__bounceInRight');
            $('#estudianteInformacionLista').addClass('animate__bounceOutRight');
            setTimeout(()=>{
                $('#estudianteInformacionLista').hide();
            },500);
            setTimeout(()=>{
                $('#EstudiantesPorClaseLista').show();
                $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutLeft');
                $('#EstudiantesPorClaseLista').addClass('animate__bounceInLeft');
            },500);
        }
    });
}

function abrirCurso(grupo){
    g_grupoAbierto = grupo;
    let curso = $('#idGrupo-'+grupo);
    $('html').scrollTop(0);
    forEachEstudiantesxGrupo(grupo);
    //revisarAsistenciaProfesor(grupo);
    $('#clasesLista').removeClass('animate__bounceInLeft');
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutRight');
    
    $('#clasesLista').addClass('animate__animated animate__bounceOutLeft');
    setTimeout(()=>{
        $('#listaFiltarClases').hide();
        $('#clasesLista').hide();
        $('#pag_ant').attr('data-page','1');
        $('#breadcrum-item-listaestudiantes').show();
        $('#pag_ant').show();
    },500);
    setTimeout(()=>{
        $('#EstudiantesPorClaseLista').show();
        $('#EstudiantesPorClaseLista').addClass('animate__animated animate__bounceInRight');
    },500);
}

function abrirEstudiante(id){
    $('html').scrollTop(0);
    showInformacionDeEstudiante(id);
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceInLeft');
    $('#EstudiantesPorClaseLista').removeClass('animate__bounceOutLeft');
    $('#estudianteInformacionLista').removeClass('animate__bounceOutRight');
    
    $('#EstudiantesPorClaseLista').addClass('animate__animated animate__bounceOutLeft');
    setTimeout(()=>{
        $('#EstudiantesPorClaseLista').hide();
        $('#pag_ant').attr('data-page','2');
        $('#breadcrum-item-estudiantesInfo').show();
        $('#pag_ant').show();
    },500);
    setTimeout(()=>{
        $('#estudianteInformacionLista').show();
        $('#estudianteInformacionLista').addClass('animate__animated animate__bounceInRight');
    },500);
}

// ? --------------------------------------- TRANSICION --------------------------------------------------
// ! ---------------------------------------  NAV --------------------------------------------------


async function traerEstudantesXGrupoAfter() {
    return new Promise((resolve, reject) => {
        let bearer = 'Bearer '+g_token;
        $.ajax({
            type: "GET",
            url: "/profesor/matriculaEstudiantes",
            contentType: "application/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            g_estudiantes = response;
            $.ajax({
                type: "GET",
                url: "/profesor/asistencia/getAsistencia",
                contentType: "application/json",
                headers:{
                    'Authorization':bearer
                }
            }).then((response) => {
                g_mapAsistencia.clear();
                console.log(response);
                if(response.length){
                    response.forEach((e =>{
                        g_mapAsistencia.get(e.id_asistencia,e);
                    }));
                }
                g_asistencia = response;
                resolve('done');
            }, (error) => {
                
            });
        }, (error) => {
            
        });
    })
}
function traerEstudantesXGrupo(){
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/profesor/matriculaEstudiantes",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_estudiantes = response;
    }, (error) => {
        
    });
    $.ajax({
        type: "GET",
        url: "/profesor/asistencia/getAsistencia",
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_mapAsistencia.clear();
        response.forEach((e =>{
            g_mapAsistencia.get(e.id_asistencia,e);
        }));
        g_asistencia = response;
    }, (error) => {
        
    });
}
function ingresarAsitenciaProfesor(){
    let bearer = 'Bearer '+g_token;

    let estado = 'Presente';
    let idProfesor = parseInt($('#id_profesor').text());
    let fecha = new Date();
    fecha = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDate();
    let grupo = parseInt(g_grupoAbierto);
    console.log(grupo)
    $.ajax({
        type: "GET",
        url: "/profesor/asistenciaProfesor/insertarAsistencia",
        data: {estado,fecha,idProfesor,grupo},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        $('#pasarAsistenciaProfesor').modal('hide');
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
          
        Toast.fire({
            icon: 'success',
            title: 'Asistencia Agregada'
        })
    }, (error) => {
        
    });
}
function saltarAsitenciaProfesor() {
    $('#pasarAsistenciaProfesor').modal('hide');
}

function filtrarEstudiantesxGrupo(grupo) {
    return g_estudiantes.filter(e => e.id_grupo == grupo);
}
function forEachEstudiantesxGrupo(grupo){
    console.log(grupo,g_mapGrupos.get(grupo))
    setTimeout(() => {
        $('#buttonTriggerModalAsistencia').show();
    }, 2000);
    $('#buttonTriggerModalAsistencia').attr("data-grupo",grupo);
    $('#grupoIdModal').html('Grupo ' + grupo);
    $('#idGrupoTemp').html( grupo);
    $('#listaUlEstudiantes').html('');
    let result = filtrarEstudiantesxGrupo(grupo);
    result.forEach((c)=>{
        mostrarEstudiantesporGrupo(c);
    });
}

function reiniciarListaAsistencia() {
    // traer los estudiantes de nuevo para reinicar la asistencia edl lado del cliente
    traerEstudantesXGrupo();
    let table = $('#tablaModalAsistencia').DataTable();
    table.destroy();
    // var id = $('#idGrupoTemp').html();
    // var grupo = g_mapGrupos.get(parseInt(id));
    // buildAsistenciaTable(grupo);

}
function updateStatus(estudiante,estado,grupo,) {
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/profesor/asistencia/actualizarEstudiante",
        data: {estado,estudiante,grupo},
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        reiniciarListaAsistencia();
        let est = g_estudiantes.filter(e => e.id_estudiante == estudiante)[0];
        est = est.nombre.toUpperCase() + ' ' + est.apellido.toUpperCase();
        switch (estado) {
            case 'Presente':
                $(`#listaAsistencia_${estudiante}_${grupo}`).append(`
                    <div class="d-block w-100 h-100 bg-success">
                    <h4 class="text-white text-center pt-4">${est} - Presente</h4>
                    </div>
                `);
                $(`#listaAsistencia_${estudiante}_${grupo}`).show();
                animateCSS(`#listaAsistencia_${estudiante}_${grupo}`,'bounceInLeft')
                break;
        case 'Ausente':
                $(`#listaAsistencia_${estudiante}_${grupo}`).append(`
                    <div class="d-block w-100 h-100 bg-danger">
                    <h4 class="text-white text-center pt-2">${est} - Ausente</h4>
                    <div class="d-block w-100">
                    <button type="button" class="btn btn-sm btn-outline-light mx-auto d-block mb-2" onclick="updateStatus('${estudiante}','Tarde',${grupo},1)">Cambiar a tarde</button>
                    <small class="text-white text-center d-block">Esto solo puede cambiar si el estudiante se presenta tarde</small>
                    </div>
                    </div>
                `);
                $(`#listaAsistencia_${estudiante}_${grupo}`).show();
                animateCSS(`#listaAsistencia_${estudiante}_${grupo}`,'bounceInLeft')
                break;
        case 'Tarde':
                $(`#listaAsistencia_${estudiante}_${grupo}`).html('');
                $(`#listaAsistencia_${estudiante}_${grupo}`).append(`
                    <div class="d-block w-100 h-100 bg-warning">
                    <h4 class="text-white text-center pt-4">${est} - Tarde</h4>
                    </div>
                `);
                $(`#listaAsistencia_${estudiante}_${grupo}`).show();
                animateCSS(`#listaAsistencia_${estudiante}_${grupo}`,'bounceInLeft')
                break;
            default:
                break;
        }
    }, (error) => {
        
    });
}
function mostrarEstudiantesporGrupo(c) {
    let id_estudiante = c.id_estudiante;
    let cedula = c.cedula;
    let id_grupo = c.id_grupo;
    let nombre = c.nombre + ' ' + c.apellido;
    let foto = '<img src="/public/uploads/'+c.foto+'" class="rounded-circle" width="30px" height="30px">';
    let hora = c.hora > 12 ? c.hora - 12 + 'pm' : c.hora + 'am';
    $('#listaUlEstudiantes').append(`
        <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2 bg-light border-0" style="min-height:120px; position:relative;">
            <div class="w-100 h-100" style="position:absolute; opacity:0.9; z-index:3; display:none;" id="listaAsistencia_${id_estudiante}_${id_grupo}">
                
            </div>
            <div class="col-2 pr-0">
                <div class="btn-group-vertical" role="group" aria-label="Actualizar Estado">
                    <button type="button" class="btn btn-sm btn-success" onclick="updateStatus('${id_estudiante}','Presente',${id_grupo})">P</button>
                    <button type="button" class="btn btn-sm mt-1 btn-danger" onclick="updateStatus('${id_estudiante}','Ausente',${id_grupo})">A</button>
                    <button type="button" class="btn btn-sm mt-1 btn-warning" onclick="updateStatus('${id_estudiante}','Tarde',${id_grupo})">T</button>
                </div>
            </div>
            <div class="col px-1">
                <h5 class="mb-1">${nombre}</h5>
                <p class="mb-1">${cedula}</p>
                <small>${c.dia} ${hora}</small>
            </div>
            <div class="col-2 px-1 d-flex flex-column">
                <div class="mx-auto" id="idEstudiantexGrupo-${id_estudiante}" onclick="abrirEstudiante('${cedula}')" role="button">${foto}</div>
            </div>
        </li>
    `);
}


function mostartClasesFiltro(fil) {
    eachGrupos(g_grupos,fil.value)
    eachGruposRepo(g_grupoReposicion,"REPO")
}
function traerGrupos(){
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/grupos/getGrupos",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        g_grupos = response;
        eachGrupos(response);
    }, (error) => {
    });
}
function filtrarRepoPorProfesor(grupo,cedula) {
    return grupo.filter(e => e.cedula_origen != cedula);
}
function filtrarPorFecha(grupo) {//fecha_reposicion
    let res = [];
    grupo.forEach(e=>{
        let f = new Date();
        f = f.getFullYear() + '-' + (f.getMonth() + 1) + '-' + f.getDate();
        if(f > e.fecha_reposicion){
            res.push(e);
        }
    })
    return res;
}
function eachGrupos(grupos,filtro = "HOY") {
    $('#clasesLista').html('');
    g_mapGrupos.clear();
    grupos.forEach((e)=>{
        if(e.cupo_actual != 0){
            showGrupos(e,filtro);
            g_mapGrupos.set(e.id_grupo,e);
        }
    });
}
async function showGrupos(g,filtro){
    let id = g.id_grupo;
    let dia = g.dia;
    let hora = g.hora > 12 ? g.hora - 12 + 'pm' : g.hora + 'am';
    let nivel = g.descripcion;
    let cupo_actual = g.cupo_actual;
    let est = cupo_actual == 1 ? 'Estudiante':'Estudiantes';
    let today = new Date();
    let diaSemana = await daytoWeekDay(dia);
    let allow = diaSemana == today.getUTCDay();
    let hoy = diaSemana == today.getUTCDay() ? '<div class="circleHoy"><img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/279/fire_1f525.png" width="30"></div>' : '';
    let rep = '<div class="circleRepo"><img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/279/umbrella-on-ground_26f1-fe0f.png" width="30"></div>';

    if(filtro == 'HOY'){
        if(allow){
            $('#clasesLista').append(`
            <div class="col-md px-0 mb-5 ${allow ? 'mostrarAsistenciaCol' : 'ocultarAsistenciaCol'}">
                <div class="card rounded-xl shadow border-0 mx-auto" style="width: 320px; position:relative;">
                    <div class="position-absolute" style="right:-20px; top:-20px;">${hoy}</div>
                    <img src="../../../img/piscina4.jpg" class="card-img-top" alt="..." height="">
                    <div class="card-body">
                        <h5 class="card-title"><i class="far fa-calendar-alt"></i> Grupo ${dia} ${hora} </h5>
                        <h6 class="card-subtitle mb-2 text-muted">${nivel}</h6>
                        <p class="card-text">${cupo_actual} ${est}</p>
                        <button class="btn btn-primary ${allow ? '' : 'disabled'}" data-grupo="${id}" id="idGrupo-${id}" onclick="abrirCurso(${id})" ${allow ? '' : 'disabled'}>Pasar Asistencia</button>
                    </div>
                </div>
            </div>
            `);
            
        }else{
        }
    }else{
        $('#clasesLista').append(`
            <div class="col-md mb-5 ${allow ? 'mostrarAsistenciaCol' : 'ocultarAsistenciaCol'}">
                <div class="card rounded-xl shadow border-0 mx-auto" style="width: 320px; position:relative;">
                    <div class="position-absolute" style="right:-20px; top:-20px;">${hoy}</div>
                    <img src="../../../img/piscina4.jpg" class="card-img-top" alt="..." height="">
                    <div class="card-body">
                        <h5 class="card-title"><i class="far fa-calendar-alt"></i> Grupo ${dia} ${hora} </h5>
                        <h6 class="card-subtitle mb-2 text-muted">${nivel}</h6>
                        <p class="card-text">${cupo_actual} ${est}</p>
                        <button class="btn btn-primary ${allow ? '' : 'disabled'}" data-grupo="${id}" id="idGrupo-${id}" onclick="abrirCurso(${id})" ${allow ? '' : 'disabled'}>Pasar Asistencia</button>
                    </div>
                </div>
            </div>
        `);
    }
}
function daytoWeekDay(day) {
    return new Promise((resolve, reject) => {
        switch (day) {
            case 'LUNES':
                resolve(1);
            case 'MARTES':
                resolve(2);    
            case 'MIERCOLES':
                resolve(3);
            case 'JUEVES':
                resolve(4);
            case 'VIERNES':
                resolve(5);
            case 'SABADO':
                resolve(6);
            case 'DOMINGO':
                resolve(0);    
        }
    })
}
function bringEstudiantesInfo(){
    let bearer = 'Bearer '+g_token;
    let cedula = $('#id_cedula').text();
    let data = {cedula}
    $.ajax({
        type: "GET",
        url: "/profesor/informacionEstudiantesMatricula",
        data: data,
        contentType: "application/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        response.forEach(e => {
            g_mapEstudiantes.set(e.cedula_estudiante,e)
        });
        g_informacionEstudiantes = response;
    }, (error) => {
    });
}

function showInformacionDeEstudiante(id){
    $('#estudianteInformacionLista').html('');
    let e = g_mapEstudiantes.get(id);
    console.log(e)
    let foto;
    let celular = e.celular_estudiante == null ? 'No Asignado' : e.celular_estudiante;
    let correo = e.correo_estudiante == null ? 'No Asignado' : e.correo_estudiante;
    let carrera = e.carrera_departamento == null ? 'No Asignado' : e.carrera_departamento;
    let telefono = e.telefono_emergencia_estudiante == null ? 'No Asignado' : e.telefono_emergencia_estudiante;
    let id_est = e.id_estudiante;
    if(e.foto_estudiante != null){
        foto = '<div class="rounded-circle" style="background-image: url(/public/uploads/'+e.foto_estudiante+'); height: 20vh;width: 20vh;background-position: center;background-size: contain;"></div>';
    }else{
        foto = '<i class="fas fa-user-circle fa-10x"></i>';
    }

    let edad = getEdad(e.nacimiento_estudiante);
    $('#estudianteInformacionLista').append(
        '<div class="card bg-light shadow-sm rounded-lg" id="estudianteInformacionCard">'+
        '<div class="card-body d-flex justify-content-between row">'+
        '<div class="align-self-center order-md-2 col-md d-flex justify-content-md-end justify-content-center">'+
        foto+
        '</div>'+
        '<div class="align-self-stretch col-md">'+
        '<h4 class="card-title">'+e.nombre_estudiante+' '+e.apellido_estudiante+'</h4>'+
        '<span class="text-muted">'+e.cedula_estudiante+'</span>'+
        '<h6>'+correo+'</h6>'+
        '<h6>'+carrera+'</h6>'+
        '<h6>'+e.sexo_estudiante+'</h6>'+
        '<h6>Celular: <a href="tel:'+celular+'" class="badge badge-success py-1" >'+celular+' <i class="fas fa-phone"></i></a></h6>'+
        '<h6>Telefono de emergencia: <a href="tel:'+telefono+'" class="badge badge-warning py-1" >'+telefono+' <i class="fas fa-phone"></i></a></h6>'+
        '<h6>'+edad+' años</h6>'+
        '</div>'+
        '</div>'+
        '</div>'
    );
}
var getEdad = (birthday) =>{
    let b = new Date(birthday);
    var ageDifMs = Date.now() - b.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

document.addEventListener("DOMContentLoaded", loaded);