var l_estudiantes


function loaded(event){
    events(event);
}

function events(event){
    getLugares();
}
const animateCSS = (element, animation) =>
    
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    let prefix = 'animate__';
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
    console.log(node)

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});
function closeFilter(params) {
    $('#containerFilter').addClass('animate__animated animate__fadeOutRight')
    setTimeout(() => {
        $('#containerFilter').removeClass('animate__animated animate__fadeOutRight')
        $('#containerFilter').hide();
    }, 1000);
}
function openFilter(params) {
    $('#containerFilter').show();
    animateCSS('#containerFilter','fadeInRight')
}

function getLugares(){
    $.ajax({
        type: "GET",
        url: "../../assets/lugares.txt",
        contentType: "text"
    }).then((data) => {
        procesarLugares(data);
    }, (error) => {
    });
}

function procesarLugares(data) {
    lugares = data;
    var lines = data.split("\n");

    var provincia = [];
    var cantones = [];
    var distritos = [];

    for (var j=0; j<lines.length -1; j++) {
        var values = lines[j].split(' ,'); 
        provincia.push((values[0])); 
        cantones.push((values[1]));
        distritos.push((values[2]));
    }
    load_provincias(provincia);
    load_cantones(cantones);
    load_distritos(distritos);
}

function load_provincias(data) {
    let provincias = data;
    provincias = provincias.filter(function(item, pos) { //elimina repetidos
        return provincias.indexOf(item) == pos;
    })
    let c = $('#provinciaSelected').attr('data-values');

    for (let provincia of provincias) {
        if(provincia == c){
            $('#provincia').append(new Option(provincia, provincia,false,true));
        }else{
            $('#provincia').append(new Option(provincia, provincia));
        }
    }
}
function load_cantones(data) {
    let pro = $('#provinciaSelected').attr('data-values');
    let c = $('#cantonSelected').attr('data-values');
    let cantones = data;
    cantones = filtrarCantonxProvincia(pro);
    $('#canton').html(' ');
    for (let canton of cantones) {
        if(canton == c){
            $('#canton').append(new Option(canton, canton,false,true));
        }else{
            $('#canton').append(new Option(canton, canton));
        }
    }
}
function load_distritos(data) {
    let distritos = data;
    let can = $('#cantonSelected').attr('data-values');
    let dis = $('#distritoSelected').attr('data-values');
    distritos = filtrarDistritoxCanton(can);
    $('#distrito').html(' ');
    for (let distrito of distritos) {
        if(distrito == dis){
            $('#distrito').append(new Option(dis, dis,false,true));
        }else{
            $('#distrito').append(new Option(distrito, distrito));
        }
    }
}
document.addEventListener("DOMContentLoaded", loaded);