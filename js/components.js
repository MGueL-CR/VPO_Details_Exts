/**
 * Crea un div generico.
 * @param {string} pClass Nombre de la clase.
 * @param {string} pId Nombre del Id.
 * @returns 
 */
function createDivs(pClass, pId) {
    let newDiv= document.createElement('div');
    newDiv.className= pClass;
    newDiv.id= pId;

    return newDiv;
}

/**
 * Crea un label generico.
 * @param {string} pForInput Referncia al input correspondiente.
 * @param {string} pValue Valor del texto a mostar.
 * @returns 
 */
function creatLabel(pForInput, pValue) {
    let labels= document.createElement('label');
    labels.className= 'labels';
    labels.htmlFor= pForInput;
    labels.textContent= pValue;

    return labels;
}

/**
 * Crea un input generico segun el tipo de input que se indique.
 * @param {string} pType Tipo de input.
 * @param {string} pClass Nombre de la clase.
 * @param {string} pId Nombre del Id.
 * @returns 
 */
function createInputs(pType, pClass, pId) {
    let newInput= document.createElement('input');
    newInput.type= pType;
    newInput.className= pClass;
    newInput.name= pId;
    newInput.id= pId;

    return newInput;
}

/**
 * Crea un input tipo botón con el evento asociado a realizar.
 * @param {string} pId Nombre del Id.
 * @param {string} pClass Nombre de la clase.
 * @param {string} pValue Texto.
 * @param {string} pEvent Tipo de evento.
 * @param {string} pFuntion Nombre de la función asignada.
 * @returns 
 */
function createButton(pId, pClass, pValue, pEvent, pFuntion) {
    let newButton = createInputs("button", pClass, pId);
    newButton.addEventListener(pEvent, pFuntion, true);
    newButton.value = pValue;

    return newButton;
}

/**
 * Crea un span generico.
 * @param {string} pValue Texto.
 * @param {string} pClass Nombre de la clase.
 * @param {string} pId Nombre del Id.
 * @returns 
 */
function createSpan(pValue, pClass, pId) {
    let newSpan = document.createElement("span");
    newSpan.innerText = pValue;
    newSpan.classList.add(pClass);
    newSpan.id = pId;

    return newSpan;
}

/**
 * Genera una lista HTML vacia.
 * @param {string} pType Tipo de lista.
 * @param {string} pClass Nombre de la clase.
 * @param {string} pId Nombre del Id.
 * @returns
 */
function createList(pType, pClass, pId) {
    let newList = document.createElement(pType);
    newList.className = pClass;
    newList.id = pId;

    return newList;
}

/**
 * Genera un recuadro del tipo fieldset.
 * @param {string} pLegend Texto para el titulo
 * @param {string} pClass Nombre de la clase
 * @param {string} pId Nombre del Id.
 * @returns 
 */
function createFieldset(pLegend, pClass, pId) {
    let newFS = document.createElement('fieldset');
    let newTitle = document.createElement('legend');
    newTitle.innerText = pLegend;
    newTitle.className = 'sfLegend';
    newTitle.id = 'sflegend';

    newFS.className = pClass;
    newFS.id = pId;

    newFS.appendChild(newTitle);
    return newFS;
}