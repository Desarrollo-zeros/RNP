const files = document.getElementById('fileControl');
var neuronas = new Neurona();
var percentron = new PerceptonUniCapa();

if(window.localStorage.neuronas != undefined){
    $("#btnCargar").show();
}

function loadeData(){
    let neurona = JSON.parse(window.localStorage.neuronas);
    neuronas.entradas = neurona.entradas;
    neuronas.salidas = neurona.salidas;
    neuronas.patrones = neurona.patrones;
    neuronas.rataAprendizaje = neurona.rataAprendizaje;
    neuronas.numeroIteracion = neurona.numeroIteracion;
    neuronas.errorMaestro = neurona.errorMaestro;
    //neuronas.pesos = neurona.pesos;
    //neuronas.umbrales = neurona.umbrales;
    //neuronas.x = neurona.x;
    //neuronas.yD = neurona.yD;
    let head = JSON.parse(localStorage.llenarTablaDatos)["head"];
    let body = JSON.parse(localStorage.llenarTablaDatos)["body"];
    $("#numeroEntrada").val(neuronas.entradas);
    $("#numeroSalida").val(neuronas.salidas);
    $("#numeroPatrones").val(neuronas.patrones);

    $("#rataAprendizaje").val(neuronas.rataAprendizaje);
    $("#numeroInteraciones").val(neuronas.numeroIteracion);
    $("#errorMaestro").val(neuronas.errorMaestro);


    if($("#tablaSimulacion").is(":visible")){
        $("#tablaSimulacion").DataTable().clear().destroy();
    }
    if($("#tablaPeso").is(":visible")){
        $("#tablaPeso").DataTable().clear().destroy();
    }
    if($("#tablaUmbral").is(":visible")){
        $("#tablaUmbral").DataTable().clear().destroy();
    }
    if($("#tableData").is(":visible")){
        $("#tableData").DataTable().clear().destroy();
    }
    llenarTablaDatos(head, body);

}

function saveData(){
    window.localStorage.neuronas = JSON.stringify(neuronas);
    window.localStorage.percentron = JSON.stringify(percentron);
    localStorage.data = JSON.stringify([
        {
            neuronas : localStorage.neuronas,
            percentron : localStorage.percentron,
            llenarTablaDatos : localStorage.llenarTablaDatos
        }
    ]);
    $.notify({
        icon: 'la la-bell',
        title: 'Guardando Informacion',
        message: 'se almeceno correctamente los pesos y umbrales',
    },{
        type: 'success',
        time: 500,
    });
}

files.addEventListener('change', event => {
    if (event.target.files.length < 1) {
        throw new Error('Seleccione un archivo para continuar.');
    }
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        // Cuando el archivo se terminó de cargar
        let lines = parseCsv(e.target.result, ';');
        llenarTablaDatos(lines.shift().map(x => x.toUpperCase()), lines);

    };
    // Leemos el contenido del archivo seleccionado
    reader.readAsBinaryString(file);
});


function parseCsv(text, separador) {
    // Obtenemos las lineas del texto
    text = text.trim();
    let lines = text.replace(/\r/g, '').split('\n');
    return lines.map(line => {
        // Por cada linea obtenemos los valores
        return line.split(separador);
    });
}


function llenarTablaDatos(head, body){
    window.localStorage.llenarTablaDatos = JSON.stringify({head,body});
    let stringHead = "";
    let stringBody = "";

    stringHead += "<tr>";
    stringHead += `<th scope=\"col\">#</th>`;
    for(let i in head){
        stringHead += `<th scope=\"col\">${head[i]}</th>`;
    }
    stringHead += "</tr>";

    $("#tableData thead").html("");
    $("#tablaSimulacion thead").html("");
    $("#tableData thead").append(stringHead);
    $("#tablaSimulacion thead").append(stringHead);
    var x = 1;
    for(let i in body){
        stringBody += `<tr>`;
        stringBody += `<td scope=\"col\">${x}</td>`;
        for(let j in body[i]){
            stringBody += `<td scope=\"col\">${body[i][j]}</td>`;
        }
        stringBody += `</tr>`;
        x++;
    }
    $("#tableData tbody").append(stringBody)

    $("#tableData").DataTable({
        pageLength : 6,
    })


    cargarNeurona(body);

}

function llenarTablaPesos(listaPesos){
    $("#tablaPeso").DataTable().clear().destroy();
    let stringBody = "";
    let x = 1;
    for(let i in listaPesos){
        stringBody += "<tr>";
        stringBody += `<td>${x}</td>`;
        stringBody += `<td>${Math.floor10(listaPesos[i],-1)}</td>`;
        stringBody += "</tr>";
        x++;
    }
    $("#tablaPeso tbody").append(stringBody);

    $("#tablaPeso").DataTable({
        pageLength : 6,
    });

    $("#tablaPeso_length").remove();
}
function llenarTablaUmbrales(listaUmbrales){
    $("#tablaUmbral").DataTable().clear().destroy();
    let stringBody = "";
    let x = 1;
    for(let i in listaUmbrales){
        stringBody += "<tr>";
        stringBody += `<td>${x}</td>`;
        stringBody += `<td>${Math.floor10(listaUmbrales[i],-1)}</td>`;
        stringBody += "</tr>";
        x++;
    }
    $("#tablaUmbral tbody").append(stringBody);

    $("#tablaUmbral").DataTable({
        pageLength : 6,
    });
    $("#tablaUmbral_length").remove();
}

function cargarNeurona(body){

    for(var i in body){
        neuronas.x[i] = new Array(2);
        neuronas.x[i][0] = parseFloat(body[i][0]);
        neuronas.x[i][1] = parseFloat(body[i][1]);
        neuronas.yD.push(parseFloat(body[i][2]));

        neuronas.x1[i] = new Array(2);
        neuronas.x1[i][0] = (body[i][0]);
        neuronas.x1[i][1] = (body[i][1]);
        neuronas.yD1[i] = new Array(1);
        neuronas.yD1[i] = (body[i][2]);

    }
    neuronas.entradas = neuronas.x[0].length == null ? 1 : neuronas.x[0].length;
    neuronas.salidas = neuronas.yD[0].length == null ? 1 : neuronas.yD[0].length;
    neuronas.patrones  = neuronas.x.length == null ? 1 : neuronas.x.length;

    $("#step1").show();
    $("#step2").show();

}


$("#formConfig").on("submit",function (evt){
    evt.preventDefault();
    neuronas.numeroIteracion = parseInt($("#numeroInteraciones").val());
    neuronas.errorMaestro = parseFloat($("#errorMaestro").val());
    neuronas.rataAprendizaje = parseFloat($("#rataAprendizaje").val());
    $("#numeroEntrada").val(neuronas.entradas);
    $("#numeroSalida").val(neuronas.salidas);
    $("#numeroPatrones").val(neuronas.patrones);
    if(neuronas.numeroIteracion >= 0 && neuronas.errorMaestro >= 0 && neuronas.rataAprendizaje >= 0){
        $(".step3").show();
        $("#btnCargar").show();
        $.notify({
            icon: 'la la-bell',
            title: 'Entrenando',
            message: 'la red se esta entrenando',
        },{
            type: 'info',
            time: 100,
        });

        percentron.entrenar(neuronas).then(x => {
            if(x){
                $.notify({
                    icon: 'la la-bell',
                    title: 'Success!',
                    message: 'La red aprendio',
                },{
                    type: 'success',
                    time: 1000,
                });
            }else{
                $.notify({
                    icon: 'la la-bell',
                    title: 'Error!',
                    message: 'la red no pudo ser entrenada',
                },{
                    type: 'danger',
                    time: 1000,
                });
            }
        });

    }else{

    }
});

$("#formSimulacion").on("submit",function (evt){
    evt.preventDefault();

    let m = neuronas.entradas;
    let n = neuronas.salidas
    let entradas =[];
    let salidas = [];


    entradas[0] = parseFloat($("#x1").val());
    entradas[1] = parseFloat($("#x2").val());

    if (entradas[0] > 2 || entradas[1] < 0)
    {
        $.notify({
            icon: 'la la-bell',
            title: 'Error!',
            message: 'El valor de entrada no puede ser mayor a 2.0',
        },{
            type: 'danger',
            time: 1000,
        });
    }else{
        let salida = percentron.simular(neuronas, entradas)[0];
        entradas[0] = ($("#x1").val());
        entradas[1] = ($("#x2").val());
       llenarTablaSimulacion(entradas,salida);
    }

});

var tablaSimulacion = [];
function llenarTablaSimulacion(entradas,salidas){


    $("#tablaSimulacion").DataTable().clear().destroy();

    let x = 1;
    let stringBody = "";
    if(tablaSimulacion.length > 0){
       for(var i in tablaSimulacion){
           stringBody += "<tr>";
           stringBody += `<td>${x}</td>`;
           stringBody += `<td>${tablaSimulacion[i].entradas[0]}</td>`;
           stringBody += `<td>${tablaSimulacion[i].entradas[1]}</td>`;
           stringBody += `<td>${tablaSimulacion[i].salidas}</td>`;
           stringBody += "</tr>";
           x++;
       }
    }

    stringBody += "<tr>";
    stringBody += `<td>${x}</td>`;
    stringBody += `<td>${entradas[0]}</td>`;
    stringBody += `<td>${entradas[1]}</td>`;
    stringBody += `<td>${salidas}</td>`;
    stringBody += "</tr>";
    x++;

    tablaSimulacion.push({
        entradas,
        salidas : parseFloat(salidas.toString())
    });

    $("#tablaSimulacion tbody").append(stringBody);

    $("#tablaSimulacion").DataTable({
        pageLength : 6,
    });
}

function graficarError(listaErrores, listaIndice, listaErrorMaestro){
    myChart.data.datasets[0].data = [];
    myChart.data.labels = [];
    let index = 1;
    for(var i in listaErrores){
        myChart.data.datasets[0].data.push(listaErrores[i]);
        myChart.data.labels.push(index++);
    }
    for(var i in listaErrorMaestro){
        myChart.data.datasets[1].data.push(listaErrorMaestro[i]);
    }
    myChart.update()

    result(listaIndice,listaErrores);

}


function result(listaIndice,listaErrores){
    $("#numeroIteracion").html("Número de Iteración: "+parseInt((listaIndice.length).toString()));
    $("#errorIteracion").val(listaErrores.length-1);


    let str = "";
    let index = 1;
    for(let i in listaErrores){
        str += `<tr><td>${index}</td><td>${listaErrores[i]}</td>`
        index++;
    }
    $("#errorIteracion tbody").html(
        str
    );
}

function inicializarPesosUmbrales(){
    try{
        neuronas.inicializarPesosUmbrales();
        $.notify({
            icon: 'la la-bell',
            title: 'Inicializando',
            message: 'Inicializando pesos y umbrales',
        },{
            type: 'info',
            time: 100,
        });

    }catch (e){
        $.notify({
            icon: 'la la-bell',
            title: 'Inicializando',
            message: 'Error al Inicializando pesos y umbrales',
        },{
            type: 'danger',
            time: 1000,
        });
    }

}

function stopRender(){
    cancel = true;
}

var cancel = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(function(){

    /**
     * Ajuste decimal de un número.
     *
     * @param	{String}	type	El tipo de ajuste.
     * @param	{Number}	value	El número.
     * @param	{Integer}	exp		El exponente(el logaritmo en base 10 del ajuste).
     * @returns	{Number}			El valor ajustado.
     */
    function decimalAdjust(type, value, exp) {
        // Si el exp es indefinido o cero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Si el valor no es un número o el exp no es un entero...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Cambio
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Volver a cambiar
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Redondeo decimal
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Redondeo hacia abajo
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Redondeo hacia arriba
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();