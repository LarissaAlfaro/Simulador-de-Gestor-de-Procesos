var cNuevo = new Queue(); //Cola de estado nuevo
var cListoP1 = new Queue(); //Cola de estado listo para procesos con prioridad 1
var cListoP2 = new Queue(); //Cola de estado listo para procesos con prioridad 2 
var cListoP3 = new Queue(); //Cola de estado listo para procesos con prioridad 3
var cTerminado = new Queue(); //Cola de estado terminado
var cBloqueado3 = new Queue(); //Cola de estado bloqueado para evento 3 
var cBloqueado5 = new Queue(); //Cola de estado bloqueado para evento 5
var ejecutando = false; //proceso en estado de ejecución, variable que indica si el el gestor esta ejecutando un proceso
var despachando = true; //variable que indica si el el gestor esta llevando a cabo un cambio de estado.
var temporizador = 0; //variable que lleva los ciclos del temporizador.
var idUltimoEjecutado = -1; //variable utilizada en evitar la monopolización de procesos.
var contadorEjecuciones = 0; //variable utilizada en evitar la monopolización de procesos.
var textoADocumento = " "; //variable de tipo string para concatenar la versión string de los procesos que se ejcutan.
var salto; //variable que almacena los saltos ingeresados por el usuario.


/**
 * @name: iniciar 
 * @description: Se ejecuta solo al inicio para crear los procesos y actualizar las colas que se imprimen.
 * @param: no recibe parámetros
 * @retorno no retorna valor
 */


function iniciar() {
    crearProcesos();
    actualizarVentana();
    imprimir();
}


/**
 * @name: verificarColas 
 * @description: Esta función se manda a llamar cada vez que se apreta el botón "avanzar" para deshabilitarlo si todos los procesos han terminado de ejecutar sus instrucciones.
 * @param: no recibe parámetros
 * @retorno no retorna valor
 */


function verificarColas() {
    if (cNuevo.first == null && cListoP1.first == null && this.cListoP2.first == null && this.cListoP3.first == null && cBloqueado3.first == null && cBloqueado5.first == null && ejecutando == false) {
        document.getElementById("botonAvanzar").disabled = true;
    } else {
        avanzar();
    }
}


/**
 * @name: crearProcesos
 * @description: Obtiene el número de procesos que va a contener el gestor de procesos de manera aleatoria. Crea una instancia por cada proceso y se le asignan los valores a los atributos (algunos de manera aleatoria) para después agregar ese proceso a la cola de nuevo.
 * @param: no recibe parámetros
 * @retorno no retorna valor
 */


function crearProcesos() {
    var nProcesos = randomN(1, 9);

    for (let i = 0; i < nProcesos; i++) {
        let proceso = new Proceso();
        proceso.pc = 0;
        proceso.contadorEvento = 0;
        proceso.estado = 0;
        proceso.id = completar(randomN(1, 9999), 4);
        proceso.cantInst = completar(randomN(10, 999), 3);
        proceso.instBloq = completar(randomN(1, proceso.cantInst - 1), 3); //La instrucción de bloqueo se asigna de manera aleatoria dentro del rango de la cantidad de instrucciones ya obtenida para este proceso.
        let evento = randomN(0, 2);

        if (evento == 0) {
            evento = 3;
        } else {
            evento = 5;
        }

        proceso.evento = evento;
        proceso.prioridad = randomN(1, 3);
        cNuevo.push(proceso); //Se va agregando cada proceso a la cola de nuevo.
    }
}


/**
 * @name: randomN
 * @description: sirve apra calcular numeros ramdom entre min y max, incluyendolos
 * @param: min: es el valor minimo, es un entero; max: es el valor maximo que puede tomar, es un entero
 * @retorno retorna un entero
 */


function randomN(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * @name: completar
 * @description: completa con ceros la cantidad de carácteres establecido para los atributos del proceso que así lo requieran.
 * @param: número(número aleatorio ya obtenido), longitud(el número de carácteres establecido para ese atributo) 
 * @retorno retorna el valor completado.
 */


function completar(numero, longitud) {
    var retorno = numero.toString();
    while (retorno.length < longitud) {
        retorno = "0" + retorno;
    }
    return retorno;
}


/**
 * @name: actualizarVentana
 * @description: Se encarga de actualizar las colas que se imprimen en pantalla obteniendo los "datos del proceso" de todos los procesos que hay en todas las colas.
 * @param: no recibe parámetros. 
 * @retorno no retorna valor.
 */


function actualizarVentana() {
    //limpiando en cada salto la representación las colas que se imprimen 
    document.getElementById("nuevo").innerHTML = " ";
    document.getElementById("listoP1").innerHTML = " ";
    document.getElementById("listoP2").innerHTML = " ";
    document.getElementById("listoP3").innerHTML = " ";
    document.getElementById("bloqueado3").innerHTML = " ";
    document.getElementById("bloqueado5").innerHTML = " ";
    document.getElementById("ejecutando").innerHTML = " ";

    if (ejecutando != false) {
        var ejecutandoString = ejecutando.aString();
        document.getElementById("ejecutando").innerHTML = ejecutandoString;
    } else {
        document.getElementById("ejecutando").innerHTML = " ";
    }

    //llamando la función impresión cola para la cola correspondiente.
    impresionCola("nuevo", cNuevo);
    impresionCola("listoP1", cListoP1);
    impresionCola("listoP2", cListoP2);
    impresionCola("listoP3", cListoP3);
    impresionCola("terminado1", cTerminado);
    impresionCola("bloqueado3", cBloqueado3);
    impresionCola("bloqueado5", cBloqueado5);
}


/**
 * @name: impresiónCola
 * @description: Limpia cada cola que se imprime en pantalla y obtiene el string de todos los procesos que se encuentran en la cola que recibió como parámetro. Luego se manda a escribir dentro del cuadro que representa esa cola.
 * @param: id(id del elemento html que muestra la versión string de los procesos), cola(nombre de la cola que se quiere imprimir.)
 * @retorno no retorna valor.
 */


function impresionCola(id, cola) {
    document.getElementById(id).innerHTML = " ";
    stringDeImpresion = " ";
    element = cola.first;
    while (element != null) {
        stringDeImpresion += `${element.value.aString()}`;
        stringDeImpresion += `<br>`;
        element = element.next;
    }
    document.getElementById(id).innerHTML = stringDeImpresion;
}


/**
 * @name: imprimir
 * @description: Imprime en consola "los datos de proceso" de los procesos que se han creado.
 * @param: no recibe parámetros
 * @retorno no retorna valor
 */


function imprimir() {
    cNuevo.toArray().forEach(element => {
        console.log(element.value.aString());
    });;
}


/**
 * @name: avanzar
 * @description: Esta es la función principal. Se manda a llamar al darle click al botón de "avanzar" y dependiendo del estados de las colas y de la cuenta de ciclos ingresados por el usuario despacha o ejecuta procesos. También en esta función se concatenan "los datos de procesos" de cada proceso.
 * @param: no recibe parámetros
 * @retorno no retorna valor
 */


function avanzar() {
    var salto = document.getElementById("noDeSaltos").value; //obtiene el número de saltos ingresados por el usuario. 
    var contadorCiclos = 0; //variable contador de los ciclos que se llevan.
    textoADocumento += `No. de saltos ingresado por el usuario: ${salto}\n`;

    while (!vacias() && contadorCiclos < salto) { //mientras todas las colas (excepto la de terminado) esten vacías, se sigue despachando o ejecutando procesos.

        if (despachando) { //si la variable despachando = true 
            temporizador = 0;
            //estos 4 llamados a funciones se encargan de realizar el cambio de estado.
            procesarBloqueado();
            procesarNuevos();
            procesarEjecutando();
            procesarListo();

            if (ejecutando != false) { //Si la variable ejecutando es diferente de false entonces es porque se esta despachando (asignar false a la variable despachando).
                contadorCiclos--;
                despachando = false;
            }

        } else { //Si la variable ejecutando es diferente de false entonces se ejecuta una instrución del proceso.

            if (ejecutando != false) {
                ejecutarInstruccion(); //se ejecuta una instrucción del proceso que se encuentra en ese estado.
            } else {
                despachando = true; //Si no se esta ejecutando una proceso entonces se establece la variable despachando en true.
            }
        }

        contarEvento(); //llamado a función que cuenta los ciclos de bloqueo de un proceso que este en ese estado.
        contadorCiclos++; //incrementa en la cuenta de ciclos.
    }

    actualizarVentana(); //cada vez que se termina de ejecutar un salto(ciclos ingresados por el usuario) se actualizan las colas que se muestran en pantalla.
    textoADocumento += `\n\n\n\n\n`;
    document.getElementById("stringDeEjecuciones").value = textoADocumento; //Se le asigna a un input la cadena de texto donde se van concatenando la versión string de los procesos que se ejecutan.
}


/**
 * @name: vacias
 * @description: Esta función verifica que todas las colas (excepto la de terminado) esten vacías y la variable que contiene el proceso que se esta ejecutando(ejecutando) sea null(no se este ejcutando un proceso). 
 * @param: no recibe parámetros
 * @retorno true 
 *          false 
 */


function vacias() {
    if (cNuevo.first == null && cListoP1.first == null && this.cListoP2.first == null && this.cListoP3.first == null && cBloqueado3.first == null && cBloqueado5.first == null && ejecutando == null) {
        return true;
    }
    return false;
}


/**
 * @name: procesarBloqueado
 * @description: Esta función primero verifica si hay procesos en la cola de bloqueados y de haberlos, revisar la cantidad de ciclos del evento que se han ejecutado para este. Si ya ha terminado la ejecución de la cantidad de ciclos correspondientes al evento entonces se saca el proceso de la cola de bloqueado para agregarlo a la cola de listo que corresponda. Realiza el cambio del atributo "estado" del proceso a 1(listo) de haberse realizado el cambio de cola.
 * @param: no recibe parámetros
 * @retorno no retorna valor.
 */


function procesarBloqueado() {
    if (cBloqueado3.first != null) {
        p = cBloqueado3.first;
        if (p.value.contadorEvento > 13) {
            p = cBloqueado3.pop();
            p.estado = 1;
            agregarListo(p);
        }
    }

    if (cBloqueado5.first != null) {
        p = cBloqueado5.first;
        if (p.value.contadorEvento > 27) {
            p = cBloqueado5.pop();
            p.estado = 1;
            agregarListo(p);
        }
    }
}


/**
 * @name: agregarListo
 * @description: Agrega el proceso a la cola de listo que corresponda (cListoP1 para prioridad 1, cListoP2 para prioridad 2, cListoP3 para prioridad 3). Realiza el cambio del atributo "estado" del proceso a 1(listo).
 * @param: no recibe parámetros
 * @retorno no retorna parámetros 
 */


function agregarListo(p) {
    p.estado = 1;
    switch (p.prioridad) {
        case 1:
            cListoP1.push(p);
            break;
        case 2:
            cListoP2.push(p);
            break;
        case 3:
            cListoP3.push(p);
            break;
    }
}


/**
 * @name: procesarNuevos
 * @description: Cambie el proceso de la cola de nuevo a la de listo que corresponda (haciendo una llamada a la función "agregarListo()"). Realiza el cambio del atributo "estado" del proceso a 1(listo).
 * @param: p (proceso que se quiere agregar a la cola de listo)
 * @retorno no retorna parámetros 
 */


function procesarNuevos() {
    if (cNuevo.first != null) {
        var p = cNuevo.pop();
        p.estado = 1;
        agregarListo(p);
    }
}


/**
 * @name: procesarEjecutando
 * @description: Esta función verifica que si se esta ejecutando un proceso entonces se obtiene su pc para comparar este con la cantidad de instrucciones del proceso y la instrucción de bloqueo del proceso, para saber si se este debe terminar, o bloquearse respectivamente. Si la instrucción no corresponde a la de terminar proceso o a la de bloqueo, entonces el proceso se agrega a cola de listo para proseguir con su ejecución posteriormente.
 * @param: no recibe párametros.
 * @retorno no retorna parámetros 
 */


function procesarEjecutando() {
    if (ejecutando != false) {
        if (ejecutando.pc >= ejecutando.cantInst) { //comparación del no. de instrucciones en el pc con la cantidad de instrucciones totales que tiene el proceso.
            ejecutando.estado = 4; //PUSE ESTE CAMBIO DE ESTADO////////////////////////////////////////////////
            cTerminado.push(ejecutando);
        } else {
            if (ejecutando.pc == ejecutando.instBloq) { //comparación del no. de instrucciones en el pc con la instrucción de bloqueo.
                if (ejecutando.evento == 3) {
                    ejecutando.estado = 3; //PUSE ESTE CAMBIO DE ESTADO////////////////////////////////////////////////
                    cBloqueado3.push(ejecutando);
                } else {
                    ejecutando.estado = 3; //PUSE ESTE CAMBIO DE ESTADO////////////////////////////////////////////////
                    cBloqueado5.push(ejecutando);
                }
            } else {
                agregarListo(ejecutando);
            }
        }
        ejecutando = false;
    }
}


/**
 * @name: procesarlisto
 * @description: se encarga de obtener el proceso que se va a ejecutar de la cola de listo. Luego evalua si este proceso es igual al proceso * anteriormente ejecutado, de no ser así entonces este proceso se ejecutara. Si si es igual al anteriormente ejecutado el máximo de segmentos *seguidos que puede tener el proceso es 3. Si el proceso quiere ejecutarse por cuarta vez consecutiva, este baja de prioridad, se reingresa a la cola de listo correspondiente y se obtiene el próximo proceso con mayor prioridad para ejecutarse. 
 * @param: no recibe párametros.
 * @retorno no retorna parámetros 
 */


function procesarListo() {
    var p = null;
    if (cListoP1.first != null) {
        p = cListoP1.peek();
    } else if (cListoP2.first != null) {
        p = cListoP2.peek();
    } else if (cListoP3.first != null) {
        p = cListoP3.peek();
    }

    if (p != null) {
        if (p.id == idUltimoEjecutado) {
            contadorEjecuciones++;
        } else {
            contadorEjecuciones = 0;
        }

        if (contadorEjecuciones >= 3 && p.prioridad < 3) {
            cambiarCola(p);
            contadorEjecuciones = 0;
        }
    }

    if (cListoP1.first != null) {
        p = cListoP1.pop();
    } else if (cListoP2.first != null) {
        p = cListoP2.pop();
    } else if (cListoP3.first != null) {
        p = cListoP3.pop();
    }

    if (p != null) {
        p.estado = 2;
        ejecutando = p;
        idUltimoEjecutado = p.id;
    }
}


/**
 * @name: cambiarCola
 * @description: Cambia de cola el proceso que recibe como parámetro, esto según la prioridad del proceso. 
 * @param: no recibe párametros.
 * @retorno no retorna parámetros 
 */


function cambiarCola(p) {
    var p2;
    if (p.prioridad == 1) {
        p2 = cListoP1.pop();
        p2.prioridad = 2;
        cListoP2.push(p2);
    } else if (p.prioridad == 2) {
        p2 = cListoP2.pop();
        p2.prioridad = 3;
        cListoP3.push(p2);
    }
}


/**
 * @name: ejecutarInstrucción
 * @description: ejecuta una instrucción del proceso que esta ejecutandose, incrementa el temporizador y el pc del proceso, concatena sus "datos del proceso" al string que contiene todos los procesos que se han ejecutado y por último verifica si se ha cumplido un segmento (temporizador==5), o se ha llegado al final de la ejecuión del proceso, o si se ha llegado a la instrucción de bloqueo para establecer despachando = true;
 * @param: no recibe párametros.
 * @retorno no retorna parámetros 
 */


function ejecutarInstruccion() {
    temporizador++;
    ejecutando.pc = ejecutando.pc + 1;
    console.log("se esta ejecutando la instruccion no.", ejecutando.pc, "del proceso con ID.", ejecutando.id);
    textoADocumento += `${ejecutando.aString()}; \n`;
    if (temporizador == 5 || ejecutando.pc == ejecutando.cantInst || ejecutando.pc == ejecutando.instBloq) {
        despachando = true;
    }
}


/**
 * @name: contarEvento
 * @description: Ejecuta una ciclo del evento de bloqueo por cada uno de los elementos de las colas de bloqueado (cBloqueado3, cBloqueado5).
 * @param: no recibe párametros.
 * @retorno no retorna parámetros 
 */


function contarEvento() {
    cBloqueado3.toArray().forEach(element => {
        element.value.contadorEvento = element.value.contadorEvento + 1;
    });;


    cBloqueado5.toArray().forEach(element => {
        element.value.contadorEvento = element.value.contadorEvento + 1;
    });;
}


/**
 * @name: ----
 * @description: Este segmento ejecuta una función cuando se le da click al botón de "Guardar Archivo de texto". La función permite que se pueda descargar un archivo en el que se mando a escribir el string que contiene todos los procesos que se han ejecutado. El nombre del archivo que se descarga es: "ejecucion[fechaActual horaActual].txt"
 */


$("#escribirArchivo").click(function() {
    var blob = new Blob([textoADocumento], { type: "text/plain;charset=utf-8" });
    fechaActual = new Date();
    saveAs(blob, `ejecucion${fechaActual.getDate()}/${fechaActual.getMonth()+1}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}:${fechaActual.getSeconds()}.txt`);
});


//Se manda a llamar a la función "iniciar()" para crear los procesos e iniciar con la ejecución del gestor de procesos al momento de que el usuario le de click al botón "avanzar".
iniciar();