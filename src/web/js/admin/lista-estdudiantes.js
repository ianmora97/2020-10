function loaded(event) {
    events(event);
}

function events(event) {
    toogleMenu();
    cargar_Estudiantes();
    dropdownhoras();
    filtrarXdia();
    toogleMenuAplicar();
}

//------------------------Cargar todos los estudiantes matriculados en al menos un curso-----------------------------Inicio---
var estudiantes = [];

function cargar_Estudiantes() {
    $.ajax({
        type: "GET",
        url: "/admin/matricula/listaest",
        contentType: "application/json",
    }).then(
        (solicitudes) => {
            estudiantes = solicitudes;
            cargarEstudiantes(solicitudes);
        },
        (error) => {
            alert(error.status);
        }
    );
}

function cargarEstudiantes(solicitudes) {
    $("#lista-estudiantes").html("");
    solicitudes.forEach((solicitudes) => {
        llenarEstudiantes(solicitudes);
    });
}

function llenarEstudiantes(solicitudes) {
    let nrc = solicitudes.codigo_taller;


    let nivel = solicitudes.nivel_taller == 1 ? 'Principiante' : solicitudes.nivel_taller == 2 ? 'Intermedio' : 'Avanzado';


    let nombre_pro = solicitudes.nombre_profesor;
    let id_matri = solicitudes.created_at;

    let cedul = solicitudes.cedula;
    let nomb =
        solicitudes.nombre.toUpperCase() +
        " " +
        solicitudes.apellido.toUpperCase();
    let horario = solicitudes.dia.toUpperCase() +
        " " + solicitudes.hora + "-" + parseInt(solicitudes.hora + 1);
    $("#lista-estudiantes").append(
        "<tr>" +
        "<td>" +
        cedul +
        " </td>" +
        "<td>" +
        nomb +
        "</td>" +
        "<td>" +
        nrc +
        "</td>" +
        "<td>" +
        horario +
        "</td>" +
        "<td>" +
        nivel +
        "</td>" +
        "<td>" +
        nombre_pro +
        "</td>" +
        "<td> por hacer</td>" +
        "<td>" +
        id_matri +
        "</td>" +
        "</tr>"
    );
}

//------------------------Cargar todos los estudiantes matriculados en al menos un curso-----------------------------Fin---

function dropdownhoras() {
    $("#dropdownboton").on("click", function () {
        $("#dropdownhoras").toggle();
    });
}

function toogleMenu() {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
}

function toogleMenuAplicar(){
    $("#aplicarFiltro").on("click", function () {  $("#dropdownhoras").hide();});
}


//--------------------------------------------------------------Partde de los filtros--
function filtrarXdia() {
    //primero obtiene los elementos marcados
    $("#aplicarFiltro").on("click", function () {
        let dias = [];
        let horas = [];
        let seleccionadosDias = $("[id*=filter_lista_dias_]");
        let seleccionadoHoras = $("[id*=horas-]")

        for (let i = 0; i < seleccionadosDias.length; i++) {
            if (seleccionadosDias[i].checked) {
                dias.push(seleccionadosDias[i].name.toUpperCase());
            }
        }

        for (let i = 0; i < seleccionadoHoras.length; i++) {
            if (seleccionadoHoras[i].checked) {
                horas.push(seleccionadoHoras[i].name);
            }
        }


        if (horas.length != 0 || dias.length != 0) {
            cargarEstudiantes(filtrarxdia(estudiantes, dias, horas));
        } else {
            cargarEstudiantes(estudiantes);
        }
    });
}

var filtrarxdia = (estudiantes, dias, horas) => {
    let result = [];

    if (horas.length == 0 && dias.length != 0) {
        for (let i = 0; i < estudiantes.length; i++) {
            for (let j = 0; j < dias.length; j++) {
                if (estudiantes[i].dia == dias[j]) {
                    result.push(estudiantes[i]);
                }
            }
        }
    }

    if (horas.length != 0 && dias.length == 0) {
        for (let i = 0; i < estudiantes.length; i++) {
            for (let w = 0; w < horas.length; w++) {
                if (estudiantes[i].hora == horas[w]) {
                    result.push(estudiantes[i]);
                }
            }
        }
    }

    if (horas.length != 0 && dias.length != 0) {
        for (let i = 0; i < estudiantes.length; i++) {
            for (let j = 0; j < dias.length; j++) {
                for (let w = 0; w < horas.length; w++) {
                    if (estudiantes[i].dia == dias[j] && estudiantes[i].hora == horas[w]) {
                        result.push(estudiantes[i]);
                    }
                }
            }
        }
    }
    return result;
};


//typeof
// parseInt(string)

document.addEventListener("DOMContentLoaded", loaded);