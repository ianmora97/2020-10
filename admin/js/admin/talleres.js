/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro

    * Javascript de Talleres
*/
var g_mapTalleres = new Map();
var g_mapHorarios = new Map();
var g_mapGrupos = new Map();
var g_mapProfesores = new Map();

function loaded(event){
    events(event);
}

function events(event){
    loadFromDb();
    openModal();
    checkClickModalDateCalendar();
    checkInputsTaller();
}

$(function () {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip()
})
function checkInputsTaller() {
    $('#codigoTallerModalAgregar').keyup(function () {
        var codigo = $('#codigoTallerModalAgregar').val();
        g_mapTalleres.forEach( e=>{
            if(e.codigo == codigo){
                $('#feedback').html('')
                $('#feedback').append(`
                    <div class="alert alert-danger alert-dismissible fade show py-2 animate__animated animate__bounceIn" role="alert">
                        <img src="/img/emoji/sad_face.png" width="30px">
                        <strong>El código debe ser único.</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
            }
        })
    });
    $('#nivelTallerModalAgregar').on("change keyup",function () {
        var nivel = $('#nivelTallerModalAgregar').val();
        g_mapTalleres.forEach( e=>{
            if(e.nivel == nivel){
                $('#feedback').html('')
                $('#feedback').append(`
                    <div class="alert alert-danger alert-dismissible fade show py-2 animate__animated animate__bounceIn" role="alert">
                        <img src="/img/emoji/sad_face.png" width="30px">
                        <strong>El nivel debe ser único</strong> ya hay un taller con este nivel. <span class="badge badge-light">${e.descripcion}</span>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
            }
        })
    });
    

}
function openmodal(modal) {
    $(modal).modal('show');
    console.log('Modal Abierto')
}

function searchonfind(barra) {
    let bar = $(barra);
    switch (bar.data('type')) {
        case 'talleres':
            var table1 = $('#talleres_table').DataTable();
            let val1 = bar.val();           
            let result1 = table1.search( val1 ).draw();
            break;
        case 'horarios':
            var table2 = $('#horarios_table').DataTable();
            let val2 = bar.val();           
            let result2 = table2.search( val2 ).draw();
            break;
        case 'grupos':
            var table3 = $('#grupos_table').DataTable();
            let val3 = bar.val();           
            let result3 = table3.search( val3 ).draw();
            break;
        default:
            break;
    }
    
}
function actualizarDatos() {
    let table = $('#talleres_table').DataTable();
    table.destroy();
    let table1 = $('#horarios_table').DataTable();
    table1.destroy();
    let table2 = $('#grupos_table').DataTable();
    table2.destroy();
    loadFromDb();
}
function openModal(){
    // ! on open
    $('#modalEditTaller').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var taller = g_mapTalleres.get(parseInt(id));

        var modal = $(this)
        modal.find('.modal-title').text('Taller #' + id)
        $('#idTallerModal').html(id)

        $('#descripcionModalTaller').val(taller.descripcion);
        $('#nivelModalTaller').val(taller.nivel);
        $('#costoestudianteModalTaller').val(taller.costo);
        $('#costofuncionarioModalTaller').val(taller.costo_funcionario);
    })
    $('#modalEditHoraio').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var horario = g_mapHorarios.get(parseInt(id));

        var modal = $(this)
        modal.find('.modal-title').text('Horario #' + id)
        $('#idHorarioModal').html(id)

        $('#diaeditarHorarioModal').val(horario.dia);
        $('#horaeditarHorarioModal').val(horario.hora);
    })
    $('#actualizarGrupo').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var id = button.data('id');
        var grupo = g_mapGrupos.get(parseInt(id));
        
        var modal = $(this)
        modal.find('.modal-title').text('Grupo #' + id)
        $('#idGrupoModal').html(id)

        $('#horarioInputActualizar').val(grupo.id_horario);
        $('#talleresSelectGrupoActualizar').val(grupo.id_taller);
        $('#profesoresSelectGrupoActualizar').val(grupo.id_profesor);
        
        $('#cupobaseActualizarModal').val(grupo.cupo_base);
        $('#cupoExtraActualizarModal').val(grupo.cupo_extra);
        $('#periodoActualizarModal').val(grupo.periodo);


    })
    // ! on close
    $('#modalEditHoraio').on('hide.bs.modal', function (event) {
        $('#feedbackHorarioEditar').html('')
    })
    $('#agregarHorario').on('hide.bs.modal', function (event) {
        $('#feedbackHorarioAgregar').html('')
    })

    $('#agregarTaller').on('hide.bs.modal', function (event) {
        $('#feedback').html('')
    })
    $('#modalEditTaller').on('hide.bs.modal', function (event) {
        $('#feedbackEditarTaller').html('')
    })
    
    $('#agregarGrupo').on('hide.bs.modal', function (event) {
        $('#feedbackAgregarGrupo').html('')
    })
    $('#actualizarGrupo').on('hide.bs.modal', function (event) {
        $('#feedbackActualizarGrupo').html('')
        $('#toogleFormActualizar').show();
    })
}
var g_modalFechaCalendario = "";
// ? ------------------------------------- Horario CRUD ------------------------------

function agregarHorario() {
    let dia = $('#diaAgregarHorarioModal').val();
    let hora = parseInt($('#horaAgregarHorarioModal').val());
    let bearer = 'Bearer '+g_token;
    if(dia && hora){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/ingresarHorario", 
            data:{dia,hora},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.fb == "good"){
                location.href = "/admin/talleres";
            }else{
                $('#feedbackHorarioAgregar').html('')
                if(response.fb.code == "ER_DUP_ENTRY"){
                    $('#feedbackHorarioAgregar').append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> Ya existe un horario con ${dia + ' ' + hora}.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `);
                }
            }
        }, (error) => {
            
        });
        
    }else{
        $('#feedbackHorarioAgregar').html('')
        $('#feedbackHorarioAgregar').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function actualizarDatosHorario() {
    let id = $('#idHorarioModal').html();
    let dia = $('#diaeditarHorarioModal').val();
    let hora = parseInt($('#horaeditarHorarioModal').val());
    let bearer = 'Bearer '+g_token;
    if(dia && hora){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/actualizarHorario", 
            data:{id,dia,hora},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/talleres";
        }, (error) => {
        });
    }else{
        $('#feedbackHorarioEditar').html('');
        $('#feedbackHorarioEditar').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function eliminarHorario() {
    let id = $('#idHorarioModal').html();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/eliminarHorario", 
        data:{id},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.fb == "good"){
            location.href = "/admin/talleres";
        }else{
            $('#feedbackHorarioEditar').html('');
            if(response.fb.code.match('ER_ROW_IS_REFERENCED')){
                $('#feedbackHorarioEditar').append(`
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Existe un grupo con este Horario debe 
                        eliminar primero el grupo antes de eliminar el horario.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
            }
        }
    }, (error) => {
    });
}

// ? ------------------------------------- Taller CRUD ------------------------------
function agregarTaller() {
    let codigo = $('#codigoTallerModalAgregar').val();
    let descripcion = $('#descripcionTallerModalAgregar').val();
    let nivel = parseInt($('#nivelTallerModalAgregar').val());
    let costoEst = parseInt($('#costoEstTallerModalAgregar').val());
    let costoFun = parseInt($('#costoFunTallerModalAgregar').val());
    let bearer = 'Bearer '+g_token;
    if(codigo && descripcion && nivel && costoEst && costoFun){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/ingresarTaller", 
            data:{codigo,descripcion,nivel,costoEst,costoFun},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.fb == "good"){
                location.href = "/admin/talleres";
            }else{
                $('#feedback').html('')
                if(response.fb.code == "ER_DUP_ENTRY"){
                    $('#feedback').append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> Ya existe un codigo con ${codigo}.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `);
                }
            }
        }, (error) => {
            
        });
    }else{
        $('#feedback').html('')
        $('#feedback').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function actualizarDatosTaller() {
    let id = $('#idTallerModal').html();
    let descripcion =  $('#descripcionModalTaller').val();
    let nivel = $('#nivelModalTaller').val();
    let costo = $('#costoestudianteModalTaller').val();
    let costo_funcionario = $('#costofuncionarioModalTaller').val();
    let bearer = 'Bearer '+g_token;
    if(descripcion && nivel && costo && costo_funcionario){
        $.ajax({
            type: "GET",
            url: "/admin/talleres/actualizarTaller", 
            data:{id,descripcion,nivel,costo,costo_funcionario},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/talleres";
        }, (error) => {
        });
    }else{
        $('#feedbackEditarTaller').html('')
        $('#feedbackEditarTaller').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function eliminarTaller() {
    let id = parseInt($('#idTallerModal').text());
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/eliminarTaller", 
        data:{id},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        if(response.fb == "good"){
            location.href = "/admin/talleres";
        }
        if(response.fb.code.match('ER_ROW_IS_REFERENCED')){
            $('#feedbackEditarTaller').html('')
            $('#feedbackEditarTaller').append(`
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Existe un grupo con este Taller, debe 
                    eliminar primero el grupo antes de eliminar el Taller.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);
        }
    }, (error) => {
    });
}
// ? ------------------------------------- Grupo CRUD ------------------------------
function agregarGrupo() {
    let horario = parseInt($('#horarioSelectGrupo').val());
    let profesor = parseInt($('#profesoresSelectGrupo').val());
    let taller = parseInt($('#talleresSelectGrupo').val());
    let cupobase = parseInt($('#cupobaseAgregarModal').val());
    let cupoextra = parseInt($('#cupoExtraAgregarModal').val());
    let periodo = $('#periodoAgregarModal').val();

    let bearer = 'Bearer '+g_token;
    if(horario && profesor && taller && cupobase && cupoextra && periodo) {
        $.ajax({
            type: "GET",
            url: "/admin/talleres/ingresarGrupo", 
            data:{horario,profesor,taller,cupobase,cupoextra,periodo},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            if(response.fb == "good"){
                location.href = "/admin/talleres";
            }else{
                $('#feedbackAgregarGrupo').html('')
                if(response.fb.code == "ER_DUP_ENTRY"){
                    $('#feedbackAgregarGrupo').append(`
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> Ya existe un grupo con .
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    `);
                }
            }
        }, (error) => {
            
        });
    }else{
        $('#feedbackAgregarGrupo').html('')
        $('#feedbackAgregarGrupo').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function actualizarDatosGrupo() {
    let id = $('#idGrupoModal').html();
    let horario = parseInt($('#horarioInputActualizar').val());
    let taller = parseInt($('#talleresSelectGrupoActualizar').val());
    let profesor = parseInt($('#profesoresSelectGrupoActualizar').val());
    let cupobase = parseInt($('#cupobaseActualizarModal').val());
    let cupoextra = parseInt($('#cupoExtraActualizarModal').val());
    let periodo = $('#periodoActualizarModal').val();

    let bearer = 'Bearer '+g_token;
    if(horario && profesor && taller && cupobase && cupoextra && periodo) {
        $.ajax({
            type: "GET",
            url: "/admin/talleres/actualizarGrupo", 
            data:{id,horario,profesor,taller,cupobase,cupoextra,periodo},
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((response) => {
            location.href = "/admin/talleres";
        }, (error) => {
        });
    }else{
        $('#feedbackEditarTaller').html('')
        $('#feedbackEditarTaller').append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong> Tiene que llenar todos los campos.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
    }
}
function eliminarGrupo() {
    $('#toogleFormActualizar').hide();
    $('#feedbackActualizarGrupo').html('')
    $('#feedbackActualizarGrupo').append(`
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Existen estudiantes matriculados en este grupo, o reposiciones asociadas a este 
            grupo. <strong>¿Desea eliminar definitivamente las 
            matriculas y todo lo asociado a este grupo?</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);
    $('#feedbackActualizarGrupo').append(`
        <div class="mx-auto">
            <small class="text-muted">Al eliminar todas las referencias a este grupo, pueden existir inconsistencias en el sistema. 
            Es recomendable primero eliminar todo lo que este asociado a este grupo.</small><br>
            <button type="button" class="btn btn-sm btn-warning" onclick="eliminarDefGrupo()">
                Eliminar definitivamente
            </button>
            <button type="button" class="btn btn-sm btn-danger" onclick="cancelarEliminarGrupo()">
                Cancelar
            </button>
        </div>
    `)
}
function cancelarEliminarGrupo() {
    $('#toogleFormActualizar').show();
    $('#feedbackActualizarGrupo').html('');
}
function eliminarDefGrupo() {
    let id = $('#idGrupoModal').html();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/eliminarGrupo", 
        data:{id},
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((response) => {
        location.href = "/admin/talleres";
    }, (error) => {
    });
}

// ! ---------------------------------------- CRUD ------------------------------
function loadFromDb() {
    let ajaxTime = new Date().getTime();
    let bearer = 'Bearer '+g_token;
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getProfesores", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((profesores) => {
        selectProfesoresFromGrupo(profesores);
    }, (error) => {

    });
    $.ajax({
        type: "GET",
        url: "/admin/talleres/getTalleres", 
        contentType: "appication/json",
        headers:{
            'Authorization':bearer
        }
    }).then((talleres) => {
        $('#talleres_stats').html(talleres.length)
        showTalleres(talleres);
        selectTallerFromGrupo(talleres);
        $.ajax({
            type: "GET",
            url: "/admin/talleres/getHorarios", 
            contentType: "appication/json",
            headers:{
                'Authorization':bearer
            }
        }).then((horarios) => {
            $('#horarios_stats').html(horarios.length)
            showHorarios(horarios);
            selectHorarioFromGrupo(horarios);
            $.ajax({
                type: "GET",
                url: "/admin/talleres/getGrupos", 
                contentType: "appication/json",
                headers:{
                    'Authorization':bearer
                }
            }).then((grupos) => {
                $('#grupos_stats').html(grupos.length)
                let totalTime = new Date().getTime() - ajaxTime;
                let a = Math.ceil(totalTime / 1000);
                let t = a == 1 ? a + ' segundo' : a + ' segundos';
                $('#infoTiming').text(t);
                showGrupos(grupos);
                fillCalendar(grupos);
            }, (error) => {
            });
        }, (error) => {
        });

    }, (error) => {
    });
    
}
function selectProfesoresFromGrupo(profesores) {
    profesores.forEach(e => {
        $('#profesoresSelectGrupo').append(`
            <option value="${e.id_profesor}">${e.nombre} ${e.apellido} - ${e.cedula}</option>
        `)
    });
    profesores.forEach(e => {
        $('#profesoresSelectGrupoActualizar').append(`
            <option value="${e.id_profesor}">${e.nombre} ${e.apellido} - ${e.cedula}</option>
        `)
    });
}
function selectTallerFromGrupo(talleres) {
    talleres.forEach(e => {
        $('#talleresSelectGrupo').append(`
            <option value="${e.id}">${e.descripcion} Nivel: ${e.nivel}</option>
        `)
    });
    talleres.forEach(e => {
        $('#talleresSelectGrupoActualizar').append(`
            <option value="${e.id}">${e.descripcion} Nivel: ${e.nivel}</option>
        `)
    });
}
function selectHorarioFromGrupo(horarios) {
    horarios.forEach(e => {
        $('#horarioSelectGrupo').append(`
            <option value="${e.id}" data-day="${e.dia}">${e.dia} ${e.hora}</option>
        `)
    });
    horarios.forEach(e => {
        $('#horarioInputActualizar').append(`
            <option value="${e.id}">${e.dia} ${e.hora}</option>
        `)
    });
}
function showTalleres(data) {
    data.forEach(e => {
        g_mapTalleres.set(e.id, e);
    });
    data.forEach(e => {
        createRowTalleres(e)
    });
    $('#talleres_table').DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay datos en la tabla",
            "info":           "Mostrando _END_ de _TOTAL_ registros",
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 registros",
            "infoFiltered":   "(Filtrado de _MAX_ registros totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "_MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron registros similares",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
        columnDefs: [
            { targets: [6], orderable: false,},
            { targets: '_all', orderable: true }
        ]
    });
    $('#infoTable_talleres').html('');
    $('#pagination_talleres').html('');
    $('#lenghtTable_talleres').html('');

    $('#talleres_table_wrapper').addClass('px-0')
    let a = $('#talleres_table_wrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');

    $('#talleres_table_filter').css('display', 'none');
    $('#talleres_table_info').appendTo('#infoTable_talleres');
    
    $('#talleres_table_paginate').appendTo('#pagination_talleres');

    $('#talleres_table_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#talleres_table_length').find('label').find('select').appendTo('#lenghtTable_talleres');
    $('#talleres_table_length').html('');
}
function showHorarios(data) {
    data.forEach(e => {
        g_mapHorarios.set(e.id, e);
    });
    data.forEach(e => {
        createRowHorarios(e)
    });
    $('#horarios_table').DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay datos en la tabla",
            "info":           "Mostrando _END_ de _TOTAL_ registros",
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 registros",
            "infoFiltered":   "(Filtrado de _MAX_ registros totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "_MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron registros similares",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
        columnDefs: [
            { targets: [3], orderable: false,},
            { targets: '_all', orderable: true }
        ]
    });
    $('#infoTable_horarios').html('');
    $('#pagination_horarios').html('');
    $('#lenghtTable_horarios').html('');

    $('#horarios_table_wrapper').addClass('px-0')
    let a = $('#horarios_table_wrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');

    $('#horarios_table_filter').css('display', 'none');
    $('#horarios_table_info').appendTo('#infoTable_horarios');
    
    $('#horarios_table_paginate').appendTo('#pagination_horarios');

    $('#horarios_table_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#horarios_table_length').find('label').find('select').appendTo('#lenghtTable_horarios');
    $('#horarios_table_length').html('');
}
function showGrupos(data) {
    data.forEach(e => {
        g_mapGrupos.set(e.id_grupo, e);
    });
    data.forEach(e => {
        createRowGrupos(e)
    });
    $('#grupos_table').DataTable({
        "language": {
            "decimal":        "",
            "emptyTable":     "No hay datos en la tabla",
            "info":           "Mostrando _END_ de _TOTAL_ registros",
            "infoEmpty":      "Mostrando 0 hasta 0 de 0 registros",
            "infoFiltered":   "(Filtrado de _MAX_ registros totales)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "_MENU_",
            "loadingRecords": "Cargando...",
            "processing":     "Procesando...",
            "search":         "Buscar:",
            "zeroRecords":    "No se encontraron registros similares",
            "paginate": {
                "first": '<i class="fas fa-angle-double-left"></i>',
                "previous": '<i class="fas fa-angle-left"></i>',
                "next": '<i class="fas fa-angle-right"></i>',
                "last": '<i class="fas fa-angle-double-right"></i>'
            },
            "aria": {
                "paginate": {
                    "first": '<i class="fas fa-angle-double-left"></i>',
                    "previous": '<i class="fas fa-angle-left"></i>',
                    "next": '<i class="fas fa-angle-right"></i>',
                    "last": '<i class="fas fa-angle-double-right"></i>'
                }
            }
        },
        columnDefs: [
            { targets: [6], orderable: false,},
            { targets: '_all', orderable: true }
        ]
    });
    $('#infoTable_grupos').html('');
    $('#pagination_grupos').html('');
    $('#lenghtTable_grupos').html('');

    $('#grupos_table_wrapper').addClass('px-0')
    let a = $('#grupos_table_wrapper').find('.row')[1];
    $(a).addClass('mx-0')
    $(a).find('.col-sm-12').addClass('px-0');

    $('#grupos_table_filter').css('display', 'none');
    $('#grupos_table_info').appendTo('#infoTable_grupos');
    
    $('#grupos_table_paginate').appendTo('#pagination_grupos');

    $('#grupos_table_length').find('label').find('select').removeClass('form-control form-control-sm')
    $('#grupos_table_length').find('label').find('select').appendTo('#lenghtTable_grupos');
    $('#grupos_table_length').html('');
}
function createRowTalleres(e) {
    $('#talleres_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td>${e.id}</td>
        <td>${e.codigo}</td>
        <td>${e.descripcion}</td>
        <td>${e.nivel}</td>
        <td>${e.costo}</td>
        <td>${e.costo_funcionario}</td>
        <td class="text-center">
          <span class="button-circle" role="button" data-id="${e.id}" data-toggle="modal" data-target="#modalEditTaller">
              <i class="fas fa-ellipsis-v"></i>
          </span>
        </td>
    </tr>
    `);
}
function createRowHorarios(e) {
    $('#horarios_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td>${e.id}</td>
        <td class="text-center">${e.dia}</td>
        <td class="text-center">${e.hora}</td>
        <td class="text-center">${e.hora_final}</td>
        <td class="text-center">
          <span class="button-circle" role="button" data-id="${e.id}" data-toggle="modal" data-target="#modalEditHoraio">
              <i class="fas fa-ellipsis-v"></i>
          </span>
        </td>
    </tr>
    `);
}
function createRowGrupos(e) {
    let h = g_mapHorarios.get(e.id_horario);
    let p = e.nombre + e.apellido;
    $('#grupos_list').append(`
    <tr style="height:calc(52vh / 10);">
        <td style="line-height: 1.5;" class="text-center">${e.id_grupo}</td>
        <td style="line-height: 1.5;">
            <div class="d-flex flex-column">
                <div><strong>Dia: </strong>${h.dia}</div>
                <div><strong>Hora: </strong>${h.hora} - ${h.hora_final}</div>
            </div>
        </td>
        <td style="line-height: 1.5;">
            <div class="d-flex flex-column">
                <div>${p}</div>
                <div><strong>${e.cedula}</strong></div>
            </div>
        </td>
        <td style="line-height: 1.5;">
            <div class="d-flex flex-column">
                <div>${e.descripcion}(N:${e.nivel})</div>
                <div><strong>${e.codigo_taller}</strong></div>
            </div>
        </td>
        <td style="line-height: 1.5;">${e.cupo_actual}/${e.cupo_base}</td>
        <td style="line-height: 1.5;">${e.cupo_extra}</td>
        <td class="text-center">
          <span class="button-circle" role="button" data-id="${e.id_grupo}" data-toggle="modal" data-target="#actualizarGrupo">
              <i class="fas fa-ellipsis-v"></i>
          </span>
        </td>
    </tr>
    `);
}
function toWeekDay(dia) {
    switch (dia) {
        case 'LUNES':
            return 1;
        case 'MARTES':
            return 2;
        case 'MIERCOLES':
            return 3;
        case 'JUEVES':
            return 4;
        case 'VIERNES':
            return 5;
        case 'SABADO':
            return 6;
        case 'SÁBADO':
            return 6;
        case 'DOMINGO':
            return 7;
        default:
            break;
    }
}
function toDayWeek(dia) {
    switch (dia) {
        case 1:
            return 'LUNES';
        case 2:
            return 'MARTES';
        case 3:
            return 'MIERCOLES';
        case 4:
            return 'JUEVES';
        case 5:
            return 'VIERNES';
        case 6:
            return 'SABADO';
        case 7:
            return 'DOMINGO';
        default:
            return 'DOMINGO';
    }
}
var calendar;
function fillCalendar(grupos) {
    var eventsArray = [];
    grupos.forEach(e => {
        let p = e.nombre + " "+ e.apellido;
        let id_matricula = e.id_matricula;
        let grupo = e.id_grupo;
        let codigo = e.codigo_taller;
        let descripcion = e.descripcion;
        // let titulo = e.nivel_taller == 1 ? 'Principiante' : 'Intermedio-Avanzado';
        let dia = e.dia;
        let hora = e.hora > 12 ? e.hora - 12 + 'pm' : e.hora + 'am';
        let horaF = e.hora > 12 ? e.hora - 12 +':00': e.hora +':00' ;
        let horaFi = e.hora > 12 ? e.hora - 11 +':00': e.hora + 1 +':00' ;
        let weekday = toWeekDay(dia.toUpperCase());
        
        let todo = `Profesor: ${p} <br>${dia}: ${e.hora}`;
        let horainicio = e.hora + ":00";
        let horafinal = (e.hora + 1) + ":00";

        eventsArray.push({
            id: grupo,
            title: descripcion,
            hora: hora,
            startTime: horainicio,
            endTime: horafinal,
            daysOfWeek: [ weekday ], 
            display: 'block',
            backgroundColor: '#4659E4',
            borderColor: '#4659E4',
            icon : "swimmer",
            codigo: codigo,
            description: todo,
        });

        
    })
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'dayGridMonth',
        height: 750,
        nowIndicator: true,
        themeSystem: 'bootstrap',
        businessHours: {
            startTime: '7:00',
            endTime: '22:00',
            dow: [ 1, 2, 3, 4, 5 ],
        },
        customButtons: {
            doHorario: {
              text: 'Crear Horario',
              click: function() {
                $('#agregarHorario').modal();
              }
            },
            doGrupo: {
              text: 'Agregar Grupo',
              click: function() {
                g_modalFechaCalendario = undefined;
                $('#agregarGrupo').modal();
              }
            }
        },
        headerToolbar: {
            start: '',
            center: 'dayGridMonth,dayGridWeek,timeGridDay,listWeek',
            end: 'doHorario doGrupo'
        },
        events: eventsArray,

        buttonText: {
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Dia',
            list:     'Lista'
        },
        dateClick: function(info) {
            g_modalFechaCalendario = info.dateStr;
            $('#agregarGrupo').modal();
        },
        eventClick: function(event) {
            let info = event.event._def.extendedProps
            console.log(event.event._def.extendedProps)
            $('.event-icon').html("<i class='fa fa-"+info.icon+"'></i>");
            $('.event-title').html(info.codigo);
            $('.event-body').html(info.description);
            $('#modal-view-event').modal();
        },
        eventContent: function (args, createElement) {
            const hora = args.event._def.extendedProps.hora;
            const icon = args.event._def.extendedProps.icon;
            const text = `<i class="fa fa-${icon}"></i> <span class="font-weight-bold">${args.event._def.title}</span> <span class="badge badge-light">${hora}</span>`;
            return {
              html: text
            };
        }
    });
    calendar.render();
    setTimeout(() => {
        $(".fc-dayGridMonth-button").trigger("click");
    }, 1000);
}
var mientras;
function checkClickModalDateCalendar(){
    $('#agregarGrupo').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        if(g_modalFechaCalendario != undefined){
            let fecha = g_modalFechaCalendario;
            g_modalFechaCalendario = undefined;
            let fecha_1 = new Date(fecha);
            let day = toDayWeek(fecha_1.getDay()+1);
            let a = $(`#horarioSelectGrupo option`).attr('data-day',day);
            console.log(day,a)
        }
    })
}
document.addEventListener("DOMContentLoaded", loaded);