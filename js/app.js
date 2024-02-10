//  Variable que funcionara como indicador de estado de cambio entre el tipo de código.
let modeActive = true;

try {

//  Valida la existencia del nodo con la clase .title y proceder 
//  con la creación e inserción del código QR en el navegador.
    if (validarNodo(document.getElementsByClassName('title')[0])) {
        const numVPO = getVPOName();
        createModal();
        setTypeCode(numVPO);
        formatTable();
        completeData(numVPO);
    }

} catch (e) {
    console.error(e);
    alert('Error no controlado, favor de validar en consola.\n\nDetalles:\n' + e);
}

/*
 *  Area para funciones  *
 */

//  Lee el texto de la clase title y lo separa para retornar 
//  el valor que esta en la posicion 1 (0, 1, 2, ...).
function getVPOName() {
    try {        
        let title= document.getElementsByClassName('title')[0].innerText;    
        return title.split(":")[1].trim();
    } catch (e) {
        console.log(e);
        throw new Error('\nNo es posible obtener el nombre de la VPO.');
    }
}

// Funcion que invierte el estado de la variable cada vez que hace clic en el boton
// Seguido llama al metodo para cambiar el tipo de código
function changeTypeCode() {
    modeActive = !modeActive;

    let qrcode = document.getElementById("scanner");
    qrcode.getElementsByTagName('img')[0].remove();
    
    if (validarNodo(qrcode.getElementsByTagName('canvas')[0])) {
        qrcode.getElementsByTagName('canvas')[0].remove();
    }

    document.getElementById("btnChangeCode").value = modeActive? 'Tipo QR' : 'Tipo Barra';

    setTypeCode(getVPOName());
}

//  Valida si existe el nodo con el valor de la VOP,
//  si existe procede a llamar las otras funciones.
function validarNodo(pNode) {
    return pNode === document.body ? false : document.body.contains(pNode);
}

//  Da formato a la tabla principal para dar espacio al QR y sus inputs.
function formatTable() {

    document.getElementsByTagName('table')[0].classList.add('principal');

    document.getElementsByClassName('title')[0].classList.add('VPOName');

    truncTable(document.querySelector("table").childNodes[1]);
    //truncTable(document.querySelector("table").childNodes[0]);
}

// Obtiene la tabla y la acorta a solo las 6 primeras filas del total real,
// por ultimo, agrega una fila extra en caso que la tabla supere las 5 primeras filas.
function truncTable(pTable) {

    document.querySelector('table').innerHTML = "";

    let newRows = [];
    const allChildrens = pTable.children.length;

    for (let indx = 0; indx < 6; indx++) {
        newRows.push(pTable.children[indx]);
    }

    newRows.forEach(eRows => {
        document.querySelector('table').appendChild(eRows);
    });

    if (allChildrens > 6) {
        let info= document.createElement('tr');
        info.innerHTML= '<td class="truncated"><p> ** This table was truncated **</p></td>';
        document.querySelector('table').appendChild(info);
    }
}

//  Intercambia el tipo de codigo que se muestra en la pagina.
function setTypeCode(pVPONumber) {

    if (modeActive) {
        generateBarCode(pVPONumber);
    } else {
        generateQRCode(pVPONumber);
    }
}

//  Llama a la libreria JsBarCode para crear el codigo de barra con el valor de la VPO/QZ.
function generateBarCode(pValor) {
    try {
        const newBarCode = document.createElement("img");
        newBarCode.id = "barcode";
        document.getElementById("scanner").appendChild(newBarCode);

        JsBarcode("#barcode", pValor, {
            format: "CODE39",
            lineColor: "#006666",
            background: "#fff",
            width: 1,
            height: 64,
            margin: 0,
            mod43: false,
            displayValue: false,
        });
    } catch (e) {
        console.log(e);
        throw new Error(
            e.name + "\nNo es posible generar el código de barras."
        );
    }
}

//  Llama a la libreria QRCode para crear el QR con el valor de la VPO/QZ.
function generateQRCode(pText) {   
    try {
        const ChartQR = document.getElementById('scanner');
    
        new QRCode(ChartQR, {
            text: pText,
            width: 64,
            height: 64,
            colorDark: "#006666",
            colorLight: "#fff"
        });
    } catch (e) {
        console.log(e);
        throw new Error( e.name + '\nNo es posible generar el código QR.')
    }
}

//  Lee toda la informacion de la descripcion, segmenta cada linea y la muestra.
function completeData(pName) {
    const descriptionFull = getDescriptionRaw();
    const descriptionRaw = getDescriptionRaw();

    let sourceData = getValue("Source", descriptionRaw);

    document.getElementById("txt01").value = pName;
    document.getElementById("txt02").value = descriptionRaw[0].split(" ").pop();
    document.getElementById("txt03").value = getTypeVPO();
    document.getElementById("txt04").value = getQuantity(sourceData);
    document.getElementById("dscFull").innerText = descriptionFull;
    getSourceLots(sourceData, "lst01");
    getSourceLots(sourceData, "lst02");
}

/**
 * Obtiene todo el texto del campo description y lo separa en segmentos.
 * @returns Array [string]
 */
function getDescriptionRaw() {
    return document.body
        .getElementsByClassName("title2")[1]
        .getElementsByTagName("font")[0]
        .innerText.split(';')
}

/**
 * Devuelve el segmento que coincida con el valor a buscar en el arreglo.
 * @param {string} pValor valor a buscar.
 * @param {Array} pDescripcion Contenido para la busqueda.
 * @returns string
 */
function getValue(pValor, pDescripcion) {
    for (let i = 0; i < pDescripcion.length; i++) {
        if (pDescripcion[i].includes(pValor)) {
            return pDescripcion[i].trim();
        }
    }
}

/**
 * Obtiene el valor del tipo de orden de la descripcion.
 * @returns string
 */
function getTypeVPO() {
    return document.body
        .getElementsByClassName("title2")[0]
        .getElementsByTagName("td")[2]
        .innerText.split(":")[1]
        .trim();
}

/**
 * Obtiene cada producto que se solicita en la descripcion.
 * @param {string} pValue Segmento de los sourcelots.
 * @param {string} pId Nombre del ID.
 */
function getSourceLots(pValue, pId) {
    let info = "";

    if (pValue.includes("INVENTORY")) {
        info = importSourceLots(pValue, "|", "(", ",");
    } else if (pValue.includes("|")) {
        info = importSourceLots((pValue.slice(pValue.indexOf("|"), pValue.length)), "|", "(", ",");
    } else {
        info = importSourceLots(pValue, ":", "(", ","); 
    }
    
    listSLs(info, pId);
}

/**
 * Devuelve en un arreglo los nombres de los sourcelots.
 * @param {string} pValue texto que contiene la informacion de los sourcelots.
 * @param {string} pIni Lee a partir del caracter indicado.
 * @param {string} pEnd Lee hasta el caracter indicado.
 * @param {string} pSplit Caracter reconocido como separador del texto.
 * @returns Array
 */
function importSourceLots(pValue, pIni, pEnd , pSplit){
    return pValue
    .slice(pValue.indexOf(pIni) + 1, pValue.indexOf(pEnd))
    .split(pSplit);
}

/**
 * Crea una lista (HTML) de los sourcelots.
 * @param {Array} pItems Arreglo que contine los nombres de los sourcelots.
 * @param {string} pId Nombre del Id de la nueva lista.
 */
function listSLs(pItems, pId) {
    let nuevaLista = document.getElementById(pId);

    for (const i of pItems) {
        let nuevoItem = document.createElement("li");
        nuevoItem.innerText = i.trim();
        nuevaLista.appendChild(nuevoItem);
    }
}

/**
 * Obtiene la cantidad de material solicitado.
 * @param {string} pValor Texto que contiene la informacion de la cantidad.
 * @returns string
 */
function getQuantity(pValor) {
    if (pValor.includes("|")) {
        let vValor = pValor
            .substr(pValor.indexOf("|") + 1, pValor.length)
            .trim();
        return vValor
            .slice(vValor.indexOf("(") + 1, vValor.indexOf(")"))
            .toString()
            .replace("Qty", " ")
            .trim();
    } else {
        return pValor
            .slice(pValor.indexOf("(") + 1, pValor.indexOf(")"))
            .toString()
            .replace("Qty", " ")
            .trim();
    }
}

/*
 *  Area de creacion de los elementos HTML  *
 */

//  Funcion para insertar los elementos que se mostraran en el encabezado.
function createHeader() {

    let header= document.createElement('header');
    let scanner= createDivs('scanner', 'scanner');
    
    let fTools= createFieldset('Tool:', 'field', 'fTool');
    fTools.appendChild(createInputs('text', 'inputs', 'iTool'));

    let fQtys= createFieldset('Qty:', 'field', 'fQty');
    fQtys.appendChild(createInputs('number', 'inputs', 'iQty'));

    let btns= createDivs('no-border', 'div3');
    btns.appendChild(createButton('btnChangeCode', 'buttons', 'Tipo QR', 'click', changeTypeCode));

    let fields= createDivs('fields', 'fields');
    fields.appendChild(fTools);
    fields.appendChild(fQtys);

    let sideA= createDivs('sideA', 'sideA');
    sideA.appendChild(scanner);
    sideA.appendChild(fields);
    sideA.appendChild(btns);

    let sideB = createDivs('sideB', 'sideB');
    sideB.appendChild(createFieldset('Date:', 'field-set', 'rDate'));
    sideB.appendChild(createFieldset('Name:', 'field-set', 'rName'));
    
    header.appendChild(sideA);
    header.appendChild(sideB);
    //document.getElementsByTagName("body")[0].appendChild(header);
    return header;
}

// Funcion que crea la estructura de la ventana / modal.
function createModal() {
    // Contenedor y fondo del modal
    let modal = createDivs("contentModal", "contentModal");

    // Cuadro general para el contenido del modal
    let ventana = createDivs("ventModal", "ventModal");

    let headerModal = createHeader();

    // Titulo y sus elementos del modal
    let lblTitle = createSpan("information", "lblTitle", "lblTitle");
    let btnClose = createButton(
        "closeModal",
        "closeModal",
        "X",
        "click",
        closeModal
    );

    // Div que contendra a lblTitle y btnClose
    let titleModal = createDivs("titleModal", "titleModal");
    titleModal.appendChild(lblTitle);
    titleModal.appendChild(btnClose);

    // Creacion de las partes del cuerpo del modal

    // Creacion de las columnas del cuerpo
    let colIzq = createDivs("infoModal", "checkOut");
    let colDer = createDivs("infoModal", "checkIn");

    // Creacion y distribucion de los elementos a los grupos y
    // Distribuir los grupos a las columnas
    colIzq.appendChild(insertItem(
        createDivs("fieldModal", "ln01"), 
        createSpan("Name VPO:", "labelModal", "lbl01"), 
        createInputs("text", "inputModal", "txt01")));

    colIzq.appendChild(insertItem(
        createDivs("fieldModal", "ln02"), 
        createSpan("VPO Type:", "labelModal", "lbl02"), 
        createInputs("text", "inputModal", "txt02")));

    colIzq.appendChild(insertItem(
        createDivs("fieldModal", "ln03"), 
        createSpan("Part Type:", "labelModal", "lbl03"), 
        createInputs("text", "inputModal", "txt03")));

    colIzq.appendChild(insertItem(
        createDivs("fieldModal", "ln04"), 
        createSpan("Sourse Lot(s):", "labelModal", "lbl04"), 
        createList("ol", "inputModal listModal", "lst01")));

    colIzq.appendChild(insertItem(
        createDivs("fieldModal", "ln05"), 
        createSpan("Quantity:", "labelModal", "lbl05"), 
        createInputs("text", "inputModal", "txt04")));

    colDer.appendChild(insertItem(
        createDivs("fieldModal", "ln08"), 
        createSpan("Location(s):", "labelModal", "lbl08"), 
        createList("ol", "inputModal listModal", "lst02")));

    // Pie de pagina
    let footerModal = createDivs("footerModal", "footerModal");
    footerModal.appendChild(createSpan("Description:\n", "dscTitle", "dscTitle"));
    footerModal.appendChild(createSpan("", "dscFull", "dscFull"));

    // Cuerpo y contenido del Modal
    let bodyModal = createDivs("bodyModal", "bodyModal");
    bodyModal.appendChild(footerModal);
    bodyModal.appendChild(colIzq);
    bodyModal.appendChild(colDer);
    //colIzq.appendChild(footerModal);

    // Agregando las secciones en el Modal
    ventana.appendChild(titleModal);
    ventana.appendChild(bodyModal);
    modal.appendChild(headerModal);
    modal.appendChild(ventana);

    // agregando el Modal al cuerpo del HTML
    document.getElementsByTagName("body")[0].appendChild(modal);

}

// Funcion que recibe la etiqueta y el input o lista y 
// los agrupa al div recibido
function insertItem(pDivGroup, pLabel, pInput) {
    pDivGroup.appendChild(pLabel);
    pDivGroup.appendChild(pInput)

    return pDivGroup;
}

// Funcion que oculta la ventana / modal.
function closeModal() {
    document.getElementById("contentModal").style.display = "none";
}