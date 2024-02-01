import { FORM_DATA, FORM_CONFIG, TABLE_COLUMNS_CONFIG, DEFAULT_CURRENT_CHOICE } from './constants.js';

let appState = {
    currentChoice: {},
    tableConfig: {
        sortedColumn: '',
        sortType: '',
        sortOrder: '',
        searchString: '',
    },
    tableData: [],
};
let formContainer;
let tableContainer;
let btnRemoveAllData;
let searchFormInput;

function loadDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('appState'));

    if (data) {
        appState.tableData = data;
    }
}

function saveDataToLocalStorage() {
    localStorage.setItem('appState', JSON.stringify([appState.currentChoice, ...appState.tableData]));
}

function createNewForm() {
    appState.currentChoice = { ...DEFAULT_CURRENT_CHOICE };

    const form = createElement(FORM_CONFIG);

    form.addEventListener('change', (event) => {
        formHandler(event.target);
    });

    formContainer.appendChild(form);
}

function createElement(nodeConfig, nodeData = null, index = null) {
    const newElement = document.createElement(nodeConfig.tag);

    if (nodeConfig.text !== undefined) {
        newElement.innerText = nodeData ? nodeData.name : nodeConfig.text;
    }

    if (nodeConfig.attributes) {
        const elementType = nodeConfig.attributes.find((elem) => elem.name === 'type')?.value;

        for (const attr of nodeConfig.attributes) {
            switch (true) {
                case (nodeData && elementType && elementType !== 'radio' && (attr.name === 'id' || attr.name === 'name')):
                case (nodeData && elementType === 'radio' && attr.name === 'id'):
                case (nodeData && attr.name === 'for'):
                    newElement.setAttribute(attr.name, `${ attr.value }-${ index }`);
                    break;
                case (nodeData && attr.name === 'value'):
                    newElement.setAttribute(attr.name, nodeData.name);
                    break;
                default:
                    newElement.setAttribute(attr.name, attr.value);
            }
        }
    }

    if (nodeConfig.children) {
        for (const childConfig of nodeConfig.children) {
            if (childConfig.isTemplate) {
                let dataForRender = FORM_DATA[childConfig.dataSrc];

                if (childConfig.dataSrc === 'models') {
                    dataForRender = dataForRender.filter(
                        (el) => el.manufacturer === appState.currentChoice.manufacturer,
                    );
                }

                dataForRender.forEach((val, i) => {
                    const child = createElement(childConfig, val, i);
                    newElement.appendChild(child);
                });
            } else {
                const child = createElement(childConfig, nodeData, index);
                newElement.appendChild(child);
            }
        }
    }

    return newElement;
}

function renderModelsList() {
    const newModelsFormList = createElement(FORM_CONFIG.children.at(-1));
    const formElem = formContainer.children[0];
    formElem.replaceChild(newModelsFormList, formElem.lastChild);
}

function removeForm() {
    if (appState.currentChoice.id) {
        appState.tableData = [appState.currentChoice, ...appState.tableData];
    }

    formContainer.replaceChildren();
}

function formHandler(formElem) {
    if (!appState.currentChoice.id) {
        appState.currentChoice.id = new Date().getTime();
    }

    const stateField = formElem.dataset.stateField;

    if (stateField === 'model') {
        const formCheckboxes = formContainer.querySelectorAll('input[type=checkbox]');

        appState.currentChoice[stateField] = [...formCheckboxes]
            .filter((el) => el.checked)
            .reduce((accum, el) => [...accum, el.value], []);
    } else {
        appState.currentChoice[stateField] = formElem.value;
    }

    if (stateField === 'manufacturer') {
        appState.currentChoice.model = [];
        renderModelsList();
    }

    updateFinalPrice();
    clearSearchForm();
    saveDataToLocalStorage();
}

function updateFinalPrice() {
    const priceElem = document.querySelector('ins#final-price');
    let finalPrice = 0;

    for (const field in appState.currentChoice) {
        const fieldAllData = FORM_DATA[`${ field }s`];

        if (fieldAllData && field !== 'model') {
            const fieldSelectedData = fieldAllData.find((el) => appState.currentChoice[field] === el.name);

            finalPrice = fieldSelectedData ? finalPrice + fieldSelectedData.price : finalPrice;
        }
    }

    if (appState.currentChoice.model.length) {
        const modelSelectedData = FORM_DATA.models.filter(
            (el) => appState.currentChoice.model.includes(el.name),
        );

        finalPrice = finalPrice * appState.currentChoice.model.length +
            modelSelectedData.reduce((accum, el) => accum + el.price, 0);
    }

    appState.currentChoice.price = finalPrice;
    priceElem.innerText = `${ finalPrice }$`;
}

function renderTable() {
    if (tableContainer.querySelector('table')) {
        tableContainer.querySelector('table').remove();
    }

    const tableElem = document.createElement('table');

    tableElem.addEventListener('click', (event) => {
        tableHandler(event.target);
    });

    const theadElem = document.createElement('thead');
    const trHeadElem = document.createElement('tr');

    for (const columnConfig of TABLE_COLUMNS_CONFIG) {
        const thElem = document.createElement('th');
        const sortArrowStr = appState.tableConfig.sortOrder === 'ASC' ? `\xa0▲` : `\xa0▼`;

        thElem.dataset.field = columnConfig.field;
        thElem.dataset.sortType = columnConfig.sortType;
        thElem.innerText = columnConfig.field === appState.tableConfig.sortedColumn
            ? columnConfig.name + sortArrowStr
            : columnConfig.name;

        trHeadElem.appendChild(thElem);
    }

    theadElem.appendChild(trHeadElem);
    tableElem.appendChild(theadElem);

    const tbodyElem = document.createElement('tbody');
    const dataForRender = appState.currentChoice.id
        ? processTableData([appState.currentChoice, ...appState.tableData])
        : processTableData(appState.tableData);

    for (const choice of dataForRender) {
        const trBodyElem = document.createElement('tr');

        for (const columnConfig of TABLE_COLUMNS_CONFIG) {
            const tdElem = document.createElement('td');

            tdElem.innerText = columnConfig.field === 'price'
                ? `${ choice[columnConfig.field] }$`
                : choice[columnConfig.field];

            trBodyElem.appendChild(tdElem);
        }

        tbodyElem.appendChild(trBodyElem);
    }

    tableElem.appendChild(tbodyElem);
    tableContainer.appendChild(tableElem);
}

function tableHandler(tableElem) {
    if (tableElem.tagName === 'TH') {
        if (appState.tableConfig.sortedColumn && appState.tableConfig.sortedColumn !== tableElem.dataset.field) {
            appState.tableConfig.sortOrder = '';
        }

        appState.tableConfig.sortedColumn = tableElem.dataset.field;
        appState.tableConfig.sortType = tableElem.dataset.sortType;
        appState.tableConfig.sortOrder = appState.tableConfig.sortOrder === 'ASC' ? 'DESC' : 'ASC';

        renderTable();
    }
}

function processTableData(rawData) {
    let processedData = [...rawData].map((el) => ({ ...el, model: el.model.join(', ') }));

    if (appState.tableConfig.searchString) {
        processedData = processedData.filter(
            (obj) => Object.values(obj).flat(Infinity).find(
                (el) => el.toString().startsWith(appState.tableConfig.searchString),
            ),
        );
    }

    if (appState.tableConfig.sortedColumn) {
        if (appState.tableConfig.sortType === 'number') {
            processedData = processedData.sort(
                (a, b) => appState.tableConfig.sortOrder === 'ASC'
                    ? Number(a[appState.tableConfig.sortedColumn]) - Number(b[appState.tableConfig.sortedColumn])
                    : Number(b[appState.tableConfig.sortedColumn]) - Number(a[appState.tableConfig.sortedColumn]),
            );
        } else {
            processedData = processedData.sort(
                (a, b) => appState.tableConfig.sortOrder === 'ASC'
                    ? a[appState.tableConfig.sortedColumn].localeCompare(b[appState.tableConfig.sortedColumn])
                    : b[appState.tableConfig.sortedColumn].localeCompare(a[appState.tableConfig.sortedColumn]),
            );
        }
    }

    return processedData;
}

function searchHandler(searchElem) {
    if (searchElem.value.length >= 3) {
        appState.tableConfig.searchString = searchElem.value;

        renderTable();
    } else if (appState.tableConfig.searchString) {
        appState.tableConfig.searchString = '';

        renderTable();
    }
}

function clearSearchForm() {
    appState.tableConfig.searchString = '';
    searchFormInput.value = '';

    renderTable();
}

function clearAllData() {
    localStorage.removeItem('appState');

    window.location.reload();
}

window.addEventListener('load', (event) => {
    loadDataFromLocalStorage();

    const btnCreate = document.querySelector('button#create');
    const btnRemove = document.querySelector('button#remove');
    formContainer = document.querySelector('div#form-container');
    tableContainer = document.querySelector('fieldset#table-container');
    btnRemoveAllData = document.querySelector('.data-control-buttons button#remove-data');
    searchFormInput = document.querySelector('.search-form input#search');

    btnCreate.addEventListener('click', (event) => {
        btnCreate.disabled = true;

        clearSearchForm();
        createNewForm();
    });
    btnRemove.addEventListener('click', (event) => {
        btnCreate.disabled = false;

        removeForm();
    });
    btnRemoveAllData.addEventListener('click', (event) => {
        clearAllData();
    });
    searchFormInput.addEventListener('input', (event) => {
        searchHandler(event.target);
    });

    renderTable();
});
