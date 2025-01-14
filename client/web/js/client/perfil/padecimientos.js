function loaded(event) {
    events(event);
}

function events(event) {
    get_padecimientos();
    insertarPadecimientos();
}
function get_padecimientos(){
    let cedula = $('#cedula').text();
    let data ={cedula}
    $.ajax({
        type: "GET",
        url: "/client/cargarPadecimientos",
        data: data,
        contentType: "application/json"
    }).then((padecimientos) => {
        padecimientos.forEach((p)=>{
            ocultarPadecimiento(p);
        });
        
    }, (error) => {
        console.log('no tiene padecimientos');
    });

}
function ocultarPadecimiento(p){
    $('#fila_'+p.descripcion.toLowerCase()).hide();
}

function insertarPadecimientos(){
    $('#ingresarPadecimientosBoton').on('click',function(){
        let id = $('#idestudiante').text();
        
        let padecimientos = $("[id*=switch-]");
        
        let padecimientosSeleccionados = [];
        for (let i = 0; i < padecimientos.length; i++) {
            if (padecimientos[i].checked) {
                padecimientosSeleccionados.push(padecimientos[i].name);
            }
        }
        let data = [];
        for (let i = 0; i < padecimientosSeleccionados.length; i++) {
            data.push({
                descripcion: padecimientosSeleccionados[i].toUpperCase(),
                observacion: $('#text_'+padecimientosSeleccionados[i]).val(),
                id: id
            });
        }
        console.log(data);
        for(let i = 0; i < data.length; i++){
            $('#spinnerWaiter').show();
            $.ajax({
                type: "POST",
                url: "/client/insertarPadecimientos",
                data: JSON.stringify(data[i]),
                contentType: "application/json"
            }).then((response) => {
                $('#spinnerWaiter').hide();
                location.href = "/client/informacionMedica";
            }, (error) => {
            }).then(()=>{
                get_padecimientos();
            });
        }
    });


}


document.addEventListener("DOMContentLoaded", loaded);
