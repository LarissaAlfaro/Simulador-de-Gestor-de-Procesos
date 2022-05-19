/**
 * @name: Queue
 * @description: Clase 'Queue' para poder instanciar y hacer uso de una cola.
 * @param: no recibe parámetros.
 * @retorno no retorna valores
 */

function Queue(){
    this.first = null;
    this.push = QueuePush;
    this.pop = QueuePop;
    this.length = QueueLength;
    this.clear = QueueClear;
    this.toArray = QueueToArray;
    this.array = new Array();
    this.peek = QueuePeek;
}


/**
 * @name: QueuePush
 * @description: Agrega un nodo con valor a la cola.
 * @param: recibe el valor a ingresar.value
 * @retorno retorna 'true' cuando se ha ingresado el elemento. 
 */


function QueuePush(value){ 
    if(!this.first){ 
        this.first = new Node(value); 
    return true;
    }else{ 
    current = this.first; 
    while(current.next){
        current=current.next;
        }
        current.next = new Node(value); 
        return true;
    }
}


/**
 * @name: QueueLength
 * @description: Obtiene la longitud de la cola.
 * @param: no recibe parámetros.
 * @retorno regresa la longitud de la cola.
 */


function QueueLength(){
    count = 0;
    current = this.first;

    while(current){
        count++;
        current=current.next;
    }
    return count;
}


/**
 * @name: QueuePop
 * @description: Elimina el primer elemento de la cola.
 * @param: no recibe parámetros.
 * @retorno no regresa valores
 */


function QueuePop(){
    if (!this.first){
        return false;
    }else{
        current = this.first;
        this.first = this.first.next; 
        return current.value; 
    }
}


/**
 * @name: QueuePeek
 * @description: obtiene el primer elemento de la cola.
 * @param: no recibe parámetros.
 * @retorno Si la cola no esta vacía entonces retorna el valor del primer nodo y 'false' si la cola esta vacía.
 */


function QueuePeek() {
    if (!this.first){
        return false;
    }else{
        current = this.first;
        return current.value;
    }
}


/**
 * @name: QueueClear
 * @description: Vacía la cola.
 * @param: no recibe parámetros.
 * @retorno true (si elimina almenos un elemento)
 *          false (la cola estaba inicialmente vacía)
 */


function QueueClear() {
    if (!this.first) {
        return false;
    }
    current = this.first;
    while(current){
        current.value=null;
        current=current.next;
    }
    return true;
}


/**
 * @name: QueueToArray
 * @description: convierte la cola en un arreglo.
 * @param: no recibe parámetros.
 * @retorno un arreglo 
 */


function QueueToArray() {
    cleanArray = new Array();
    this.array = cleanArray;
    if(!this.first){
        return this.array;
    }

    current=this.first;
    while(current){
        this.array.push(current);
        current=current.next;
    }
    return this.array;
}


