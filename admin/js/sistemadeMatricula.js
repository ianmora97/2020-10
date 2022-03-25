
var g_talleres = new Array();
var g_grupos = new Array();
var g_mapTalleres = new Map();
var g_mapGrupos = new Map();
var g_matriculaTemp = new Map();

function loaded(event){
    checkSesion();
    checkInputSesionEst();
    loadDB();
}
moment.locale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);
function checkSesion(){
    if(localStorage.getItem("sesion_sm_siap") == null){
        $("#datos-btn-check").html(`
            <a href="#" data-toggle="modal" data-target="#iniciarSesion" 
            class="btn btn-primary">Iniciar Sesión</a>
        `)
    }else{

    }
}
function findEstudent(cedula){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type: "GET",
            url: "/api/checkEst/"+cedula,
            contentType: "application/json"
        }).then((res) => {
            resolve(res);
        },(error) => {
            reject(error);
        });
    });
}
async function checkInputSesionEst(){
    $("#inicioSesion-cedula").keyup(function(event){
        let val = $(this).val();
        if(val.length > 8){
            findEstudent(val).then((res)=>{
                if(res){
                    $("#claveInicioDrop").show();
                    animateCSS('#claveInicioDrop','slideInDown');
                }else{
                }
            },(error)=>{
                console.log(error);
            });
        }
    });
}
function loadDB(){
    // dropdownFilterNiveles
    $.ajax({
        type: "GET",
        url: "/api/talleres",
        contentType: "application/json"
    }).then((res) => {
        g_talleres = res.talleres;
        g_grupos = res.grupos;
        g_grupos = g_grupos.filter(e =>{ 
            return e.cupo_actual < e.cupo_base;
        })
        getTalleres(g_talleres);
        buildGruposCards(g_grupos);
    },(error) => {
        console.log(error);
    });
}

function getTalleres(talleres){
    $("#dropdownFilterNiveles").html('');
    talleres.forEach(e => {
        $("#dropdownFilterNiveles").append(`
            <a class="dropdown-item" href="#" onclick="selectDropdownNivel('${e}')">${e}</a>
        `);
    });
}
function buildGruposCards(grupos){
    $("#gruposCards").html('');
    grupos.forEach((e,i) => {
        g_mapGrupos.set(e.id_grupo,e);
        showGruposCards(e,i);
    });
}
function showGruposCards(e,i){
    $("#gruposCards").append(`
        <div class="col-md-6 col-lg-4 mt-4">
            <div class="card-grupo animate__animated animate__fadeIn" style="animation-delay: 
            ${i}00ms; min-height:300px;" id="grupoidcard-${e.id_grupo}" role="button">
                <div class="d-flex justify-content-center align-items-start mb-3">
                    <div class="pl-2 rounded-circle bg-light-alt" style="width: 45px; height: 45px;">
                        <img src="/img/emoji/man-swim.png" class="" style="width: 85%;">
                    </div>
                </div>
                <div class="d-flex justify-content-center flex-column text-center">
                    <h4 class="font-weight-bold">${e.descripcion}</h4>
                    <p class="text-muted"><span class="text-capitalize">${e.dia.toLowerCase()}</span> ${e.hora} - ${e.hora_final}</p>
                </div>
                <div class="d-flex justify-content-around mt-3">
                    <div>
                        <div class="d-flex justify-content-start align-items-center">
                            <a role="button" href="#" class="btn btn-primary rounded-circle" 
                            style="width:40px;height:40px; padding-left:9px;"><i class="fas fa-user-friends"></i></a>
                            <div class="d-flex justify-content-center flex-column ml-2">
                                <h4 class="font-weight-bold mb-0">${e.cupo_base - e.cupo_actual}</h4>
                                <small class="text-muted">Cupos</small>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button role="button" style="width:40px;height:40px;" href="#" data-id="${e.id_grupo}" 
                        onclick="agregarMatriculaTemp('${e.id_grupo}')" class="btn btn-success rounded-circle">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

            </div>
            <script>
                tippy('#grupoidcard-${e.id_grupo}', {
                    content: '${e.descripcion}',
                    placement: 'bottom',
                    animation: 'shift-away-extreme',
                });
            </script>
        </div>
    `);
}
var g_mapBusqueda = new Map();

function selectDropdownDia(dia){
    g_mapBusqueda.set("dia",dia);
    doFilterandShow();
}
function selectDropdownHora(hora){
    g_mapBusqueda.set("hora",hora);
    doFilterandShow();
}
function selectDropdownNivel(nivel){
    g_mapBusqueda.set("nivel",nivel);
    doFilterandShow();
}
function doFilterandShow(){
    $("#filterBadges").html('');
    g_mapBusqueda.forEach((e,i)=>{
        $("#filterBadges").append(`
            <h5>
                <span class="badge badge-primary mr-2">
                    <a href="#" onclick="removeFilter('${i}')" class="text-white"><i class="fas fa-times-circle"></i></a>
                    ${e}
                </span>
            </h5>
        `);
    });
    let grupos = g_grupos;
    if(g_mapBusqueda.has("dia")){
        grupos = grupos.filter(e =>{
            return e.dia.toLowerCase() == g_mapBusqueda.get("dia").toLowerCase();
        });
    }
    if(g_mapBusqueda.has("hora")){
        grupos = grupos.filter(e =>{
            return moment(e.hora,"h:ma").format('h') == moment(g_mapBusqueda.get("hora"),"h:m a").format('h');
        });
    }
    if(g_mapBusqueda.has("nivel")){
        grupos = grupos.filter(e =>{
            return e.descripcion.toLowerCase() == g_mapBusqueda.get("nivel").toLowerCase();
        });
    }
    buildGruposCards(grupos);
}
function removeFilter(filter){
    g_mapBusqueda.delete(filter);
    doFilterandShow();
}

function agregarMatriculaTemp(id_grupo){
    $("#cursosMatriculadosTemp").html('');
    if(g_matriculaTemp.size < 3){
        if(!g_matriculaTemp.has(id_grupo)){
            g_matriculaTemp.set(id_grupo,g_mapGrupos.get(parseInt(id_grupo)));
        }
    }
    fillMatriculaTempShow();
}
function fillMatriculaTempShow(){
    g_matriculaTemp.forEach((e,i) => {
        $("#cursosMatriculadosTemp").append(`
            <div class="col-md-4 mt-md-0 mb-3">
                <div class="bg-primary rounded-3 p-3 text-white">
                    <span role="button" onclick="removeFromMatricula('${i}')" class="text-white"><i class="fas fa-times-circle"></i></span>
                    <p class="font-weight-bold mb-0">${e.descripcion}</p>
                    <p class="mb-0"><span class="text-capitalize">${e.dia.toLowerCase()}</span> ${e.hora} - ${e.hora_final}</p>
                </div>
            </div>
        `);
    });
}
document.addEventListener("DOMContentLoaded", loaded);