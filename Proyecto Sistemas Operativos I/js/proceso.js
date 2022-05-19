/**
 * @name: Proceso
 * @description: Clase 'Proceso' para poder instanciar y hacer uso de un proceso y de sus atributos.
 * @param: no recibe parámetros.
 * @retorno no retorna valores
 */

function Proceso () {
    this.id;
    this.estado;
    this.prioridad;
    this.cantInst;
    this.instBloq;
    this.evento;
    this.pc;
    this.contadorEvento;
    this.aString = atributosAString;
}


/**
 * @name: atributosAString
 * @description: Concierte a una cadena todos los datos del proceso.
 * @param: no recibe parámetros.
 * @retorno el string de los datos del proceso.
 */


function atributosAString () {
    return `${this.id}/${this.estado}/${this.prioridad}/${this.cantInst}/${this.instBloq}/${this.evento}/${this.pc}`;
}

