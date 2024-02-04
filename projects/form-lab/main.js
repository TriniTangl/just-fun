// Імпорт констант із іншого файлу
import { FORM_DATA, FORM_CONFIG, TABLE_COLUMNS_CONFIG, DEFAULT_CURRENT_CHOICE } from './constants.js';

/*
 * Об'єкт, де зберігаються введені дані, збережені дані, а також параметри, які необхідні для роботи додатку - сховище даних
 *
 * @field currentChoice - введені дані із створеної активної форми, тут міститься об'єкт зі структурою DEFAULT_CURRENT_CHOICE - активні дані
 * @field tableConfig - параметри відображення таблиці
 * @field tableData - масив збережених даних, які були введені раніше - збережені дані
 * */
let appState = {
    currentChoice: {},
    tableConfig: {
        sortedColumn: '', // Назва поля об'єкту типу CHOICE, по якому зараз виконується сортування
        sortType: '', // Тип даних поля, по якому зараз виконується сортування
        sortOrder: '', // Порядок сортування: ASC - від А до Я, DESC - від Я до А
        searchString: '', // Введені символи, по яким зараз виконується пошук
    },
    tableData: [],
};
let formContainer; // Змінна для збергігання елемента контейнера форми
let tableContainer; // Змінна для збергігання елемента контейнера таблиці
let btnRemoveAllData; // Змінна для збергігання елемента кнопки для очищення всіх данних
let searchFormInput; // Змінна для збергігання елемента поля для пошуку

/*
 * Функція завантажує дані із LocalStorage сховища та зберігає їх в appState.tableData, якщо вони існують
 * */
function loadDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('appState'));

    if (data) {
        appState.tableData = data;
    }
}

/*
 * Функція зберігає дані до LocalStorage сховища - раніше створені, а також поточні, які вводить користувач
 * */
function saveDataToLocalStorage() {
    localStorage.setItem('appState', JSON.stringify([appState.currentChoice, ...appState.tableData]));
}

/*
 * Функція генерує форму та додає її на сторінку в елемент контейнера форми
 * */
function createNewForm() {
    // Оновлення обʼєкту активних даних
    appState.currentChoice = { ...DEFAULT_CURRENT_CHOICE };

    // Генерування нової форми
    const form = createElement(FORM_CONFIG);

    // Додавання прослуховувача події 'change' на створену форму
    form.addEventListener('change', (event) => {
        formHandler(event.target);
    });

    // Додавання форми на сторінку в елемент контейнера форми
    formContainer.appendChild(form);
}

/*
 * Функція створює рекурсивним методом елементи на основі переданого об'єкта конфігурації та даних
 *
 * @param nodeConfig - об'єкт конфігурації елемента та його нащадків, описаний в об'єкті константі FORM_CONFIG
 * @param nodeData - дані, які потрібно додати у форму або відобразити користувачеві, описані в об'єкті константі FORM_DATA
 * @param index - індекс елементу для створення однотипних елементів форми, з різними атрибутами, які повинні бути унікальними
 * @return {HTMLElement} - повертає створений HTML елемент
 * */
function createElement(nodeConfig, nodeData = null, index = null) {
    // Створення нового елементу на основі назви його тегу
    const newElement = document.createElement(nodeConfig.tag);

    if (nodeConfig.text !== undefined) {
        // Додавання тексту до елемента для відображення користувачеві із об'єкта конфігурації елементу або переданих даних
        newElement.innerText = nodeData ? nodeData.name : nodeConfig.text;
    }

    if (nodeConfig.attributes) {
        // Перевірка чи має елемент атрибут 'type' та отримання значення цього атрибута
        const elementType = nodeConfig.attributes.find((elem) => elem.name === 'type')?.value;

        // Циклічне додавання атрибутів елемента на основі масиву із конфігурації
        for (const attr of nodeConfig.attributes) {
            switch (true) {
                case (nodeData && elementType && elementType !== 'radio' && (attr.name === 'id' || attr.name === 'name')):
                case (nodeData && elementType === 'radio' && attr.name === 'id'):
                case (nodeData && attr.name === 'for'):
                    // Додавання до шаблонних елементів атрибутів 'for', 'id' та 'name' (для елементів НЕ типу 'radio')
                    // із індексом, щоб вони були унікальними
                    newElement.setAttribute(attr.name, `${ attr.value }-${ index }`);
                    break;
                case (nodeData && attr.name === 'value'):
                    // Додавання даних до атрибуту 'value', що властиво шаблонним елементам згідно конфігурації
                    newElement.setAttribute(attr.name, nodeData.name);
                    break;
                default:
                    // Додавання решти атрибутів для решти елементів
                    newElement.setAttribute(attr.name, attr.value);
            }
        }
    }

    if (nodeConfig.children) {
        // Циклічне створення дочірніх елементів створюваного елемента
        for (const childConfig of nodeConfig.children) {
            // Перевірка чи є дочірній елемент шаблонним
            if (childConfig.isTemplate) {
                // Отримання даних для шаблонних елементів
                let dataForRender = FORM_DATA[childConfig.dataSrc];

                // Дані для елементів, що дозволяють вибрати модель, мають бути відсортовані за поточним вибраним виробником
                if (childConfig.dataSrc === 'models') {
                    dataForRender = dataForRender.filter(
                        (el) => el.manufacturer === appState.currentChoice.manufacturer,
                    );
                }

                // Циклічно-рекурсивне створення дочірніх елментів та додавання їх в поточний елемент
                dataForRender.forEach((val, i) => {
                    const child = createElement(childConfig, val, i);
                    newElement.appendChild(child);
                });
            } else {
                // Створення звичайного дочірнього елмента та додавання його в поточний елемент
                const child = createElement(childConfig, nodeData, index);
                newElement.appendChild(child);
            }
        }
    }

    // Почернення створеного елменту
    return newElement;
}

/*
 * Функція створює список моделей для вибору
 * */
function renderModelsList() {
    // Генерування списку моделей на основі частини конфігурації, де вони описані
    const newModelsFormList = createElement(FORM_CONFIG.children.at(-1));
    // Пошук часини форми, де повинен бути відображений список моделей
    const formElem = formContainer.children[0];
    // Заміна відображеного користувачеві списку на новий згенерований
    formElem.replaceChild(newModelsFormList, formElem.lastChild);
}

/*
 * Функція видаляє форму зі сторінки та переносить поточні введені дані до списку раніше введених - зберігає їх
 * */
function removeForm() {
    // Перевірка чи активні дані містить згенероване ID
    if (appState.currentChoice.id) {
        // Якщо так, то переносимо активні дані в збережені дані
        appState.tableData = [appState.currentChoice, ...appState.tableData];
    }

    // Повністю очищуємо елемент контейнера форми від нащадків
    formContainer.replaceChildren();
}

/*
 * Функція обробляє подію 'change', яка викликається на елементах форми
 *
 * @param formElem - елемент форми, який викликав подію 'change'
 * */
function formHandler(formElem) {
    // Перевірка чи активні дані містить пусте ID
    if (!appState.currentChoice.id) {
        // Якщо так, то генеруємо нове ID на основі поточної часової мітки
        appState.currentChoice.id = new Date().getTime();
    }

    // Отримуємо назву поля, куди потрібно записати дані, із атрибута елемента
    const stateField = formElem.dataset.stateField;

    // Якщо це поле 'model'...
    if (stateField === 'model') {
        // То шукаємо всі елементи 'input' типу 'checkbox', які містяться в елементі контейнеру форми
        const formCheckboxes = formContainer.querySelectorAll('input[type=checkbox]');

        appState.currentChoice[stateField] = [...formCheckboxes] // Перетворюємо список знайдених елементів на масив
            .filter((el) => el.checked) // Фільтруємо його і відбираємо лише ті елементи, які вибрані користувачем
            .reduce((accum, el) => [...accum, el.value], []); // Записуємо дані із вибраних елементів в поле 'model' у вигляді масиву
    } else {
        // Інакше зберігаємо в обʼєкт із поточними даними в це поле дані із елемента
        appState.currentChoice[stateField] = formElem.value;
    }

    // Якщо це поле 'manufacturer', то...
    if (stateField === 'manufacturer') {
        // Очищеємо вибрані користувачем моделі
        appState.currentChoice.model = [];
        // Перемальовуємо список моделей заново
        renderModelsList();
    }

    // Перераховуємо та оновлюємо фінальну ціну
    updateFinalPrice();
    // Очищуємо поле пошуку, щоб користувач точно побачив нові дані в таблиці
    clearSearchForm();
    // Зберігаємо дані до LocalStorage сховища
    saveDataToLocalStorage();
}

/*
 * Функція перераховує та оновлює фінальну ціну на сторінці
 * */
function updateFinalPrice() {
    // Отримуємо елемент для відображення ціни на сторінці
    const priceElem = document.querySelector('ins#final-price');
    // Змінна для зберігання порахованої ціни
    let finalPrice = 0;

    // Циклічно проходимося по всім полям об'єкта із активними даними
    for (const field in appState.currentChoice) {
        // Намагаємося отримати дані призначені для цього поля із константи об'єкта FORM_DATA
        const fieldAllData = FORM_DATA[`${ field }s`];

        // Якщо такі дані снують і поточне поле не є 'model'
        if (fieldAllData && field !== 'model') {
            // Шукаємо саме того виробника, фарбу, рік і т.д., які вибрав користувач
            const fieldSelectedData = fieldAllData.find((el) => appState.currentChoice[field] === el.name);

            // Якщо такі дані існують, то додаємо їх до змінної finalPrice, а інакше не змінюємо її
            finalPrice = fieldSelectedData ? finalPrice + fieldSelectedData.price : finalPrice;
        }
    }

    // Якщо користувач вибрав 1 і більше моделей
    if (appState.currentChoice.model.length) {
        // Вибираємо всі вибрані користувачем моделі із константи об'єкта FORM_DATA
        const modelSelectedData = FORM_DATA.models.filter(
            (el) => appState.currentChoice.model.includes(el.name),
        );

        // Перераховуємо нову фінальну ціну як:
        // Базова ціна (попередньо порахована вартість) * Кількість вибраних моделей + Сума всіх надбавок за кожну вибрану модель
        finalPrice = finalPrice * appState.currentChoice.model.length +
            modelSelectedData.reduce((accum, el) => accum + el.price, 0);
    }

    // Зберігаємо нову фінальну ціну в активні дані
    appState.currentChoice.price = finalPrice;
    // Оновлюємо фінальну ціну на сторінці для користувача
    priceElem.innerText = `${ finalPrice }$`;
}

/*
 * Функція генерує таблицю та додає її на сторінку
 * */
function renderTable() {
    // Перевірка чи на сторінці вже існує таблиця в елементі контейнеру таблиці
    if (tableContainer.querySelector('table')) {
        // Якщо так, то видаляємо її
        tableContainer.querySelector('table').remove();
    }

    // Створення елемента 'table'
    const tableElem = document.createElement('table');
    // Створення елемента таблиці 'thead'
    const theadElem = document.createElement('thead');
    // Створення елемента таблиці 'tr' для хедера таблиці
    const trHeadElem = document.createElement('tr');

    // Додавання прослуховувача події 'click' на створений хедер таблиці
    theadElem.addEventListener('click', (event) => {
        tableHandler(event.target);
    });

    // Циклічне створення заголовіків колонок для хедера таблиці
    for (const columnConfig of TABLE_COLUMNS_CONFIG) {
        // Створення елемента комірки заголовка для колонки таблиці
        const thElem = document.createElement('th');
        // Визначення стрілочки для позначення сортування на основі записаного порядку сортування
        const sortArrowStr = appState.tableConfig.sortOrder === 'ASC' ? `\xa0▲` : `\xa0▼`;

        // Додавання до комірки атрибута із назвою поля об'єкта з даними
        thElem.dataset.field = columnConfig.field;
        // Додавання до комірки атрибута із типом даних для сортування
        thElem.dataset.sortType = columnConfig.sortType;
        // Додавання до комірки тексту
        // Якщо поле цієї комірки записано в сховищі як таке, що зараз сортується, то додаємо до тексту стрілочку, а інакше виводимо як є
        thElem.innerText = columnConfig.field === appState.tableConfig.sortedColumn
            ? columnConfig.name + sortArrowStr
            : columnConfig.name;

        // Додавання елементу комірки в елемент рядка хедера таблиці
        trHeadElem.appendChild(thElem);
    }

    // Додавання елементу рядка в елементу хедера таблиці
    theadElem.appendChild(trHeadElem);
    // Додавання елементу хедеру в саму таблицю
    tableElem.appendChild(theadElem);

    // Створення елемента таблиці 'tbody'
    const tbodyElem = document.createElement('tbody');
    // Отримання вже оброблених даних для відображення в таблиці
    // Якщо ID в об'єкті активних даних існує, то на обробку відправляється масив із об'єкта активних даних
    // та масиву збережених даних. Якщо ж ні, то лише масив збережених даних
    const dataForRender = appState.currentChoice.id
        ? processTableData([appState.currentChoice, ...appState.tableData])
        : processTableData(appState.tableData);

    // Циклічне створення рядків із даними на основі оброблених даних
    for (const choice of dataForRender) {
        // Створення елемента рядка таблиці 'tr' для комірок даних
        const trBodyElem = document.createElement('tr');

        // Циклічне створення комірок із даними на основі даних та константи із описом колонок таблиці
        for (const columnConfig of TABLE_COLUMNS_CONFIG) {
            // Створення елемента комірки таблиці 'td'
            const tdElem = document.createElement('td');

            // Додавання тексту в комірку таблиці
            // Якщо це комірка для ціни, то додаємо символ '$' в кінець, а інакше додаємо дані як є
            tdElem.innerText = columnConfig.field === 'price'
                ? `${ choice[columnConfig.field] }$`
                : choice[columnConfig.field];

            // Додавання елементу комірки в елемент рядка таблиці
            trBodyElem.appendChild(tdElem);
        }

        // Додавання елементу рядка таблиці в елемент основного тіла таблиці
        tbodyElem.appendChild(trBodyElem);
    }

    // Додавання елементу тіла таблиці в саму таблицю
    tableElem.appendChild(tbodyElem);
    // Додавання самої таблиці в елемент контейнера таблиці
    tableContainer.appendChild(tableElem);
}

/*
 * Функція обробляє подію 'click', яка викликається на елементах комірок хедера таблиці
 *
 * @param tableElem - елемент хедера таблиці, який викликав подію
 * */
function tableHandler(tableElem) {
    // Код виконується лише для елементів, які є тегом 'th'
    if (tableElem.tagName === 'TH') {
        // Якщо до цього вже було сортування таблиці і воно було НЕ за тією ж колонкою, що й цього разу, то...
        if (appState.tableConfig.sortedColumn && appState.tableConfig.sortedColumn !== tableElem.dataset.field) {
            // Очищення порядку сортування, якйи записаний в сховищі
            appState.tableConfig.sortOrder = '';
        }

        // Запис поля для фільтрації в сховище
        appState.tableConfig.sortedColumn = tableElem.dataset.field;
        // Запис типу даних для фільтрації в сховище
        appState.tableConfig.sortType = tableElem.dataset.sortType;
        // Запис порядку для фільтрації в сховище
        // Якщо до цього був звписаний порядок 'ASC', то записуємо новий порядок 'DESC' - для всіх інших випадків лише 'ASC'
        appState.tableConfig.sortOrder = appState.tableConfig.sortOrder === 'ASC' ? 'DESC' : 'ASC';

        // Заново перемальовуємо всю таблицю
        renderTable();
    }
}

/*
 * Функція обробляє дані для відображення їх у таблиці
 *
 * @param rawData - масив оригінальних даних
 * @return {Array} - повертає відсортовані та відфільтровані дані згідно налаштувань користувача
 * */
function processTableData(rawData) {
    // Обробляємо всі дані так, щоб в кожному полі 'model' був не масив текстових даних, а один текстовий рядок через кому
    let processedData = [...rawData].map((el) => ({ ...el, model: el.model.join(', ') }));

    // Якщо користувач щось вводив у поле пошуку
    if (appState.tableConfig.searchString) {
        // Фільтруємо всі дані так, щоб дані в будь-якому полі починалися із введеного користувачем тексту для пошку
        processedData = processedData.filter(
            (obj) => Object.values(obj).flat(Infinity).find(
                (el) => el.toString().startsWith(appState.tableConfig.searchString),
            ),
        );
    }

    // Якщо користувач вибрав колонку для сортування таблиці
    if (appState.tableConfig.sortedColumn) {
        // Якщо тип даних для сортування 'number'...
        if (appState.tableConfig.sortType === 'number') {
            // То сортуємо дані функцією для чисел
            processedData = processedData.sort(
                (a, b) => appState.tableConfig.sortOrder === 'ASC'
                    ? Number(a[appState.tableConfig.sortedColumn]) - Number(b[appState.tableConfig.sortedColumn])
                    : Number(b[appState.tableConfig.sortedColumn]) - Number(a[appState.tableConfig.sortedColumn]),
            );
        } else {
            // Інакше сортуємо функцією для тексту
            processedData = processedData.sort(
                (a, b) => appState.tableConfig.sortOrder === 'ASC'
                    ? a[appState.tableConfig.sortedColumn].localeCompare(b[appState.tableConfig.sortedColumn])
                    : b[appState.tableConfig.sortedColumn].localeCompare(a[appState.tableConfig.sortedColumn]),
            );
        }
    }

    // Повертаємо відфільтровані та відсортовані дані
    return processedData;
}

/*
 * Функція обробляє подію 'input', яка викликається при введенні даних в поле пошуку
 *
 * @param searchElem - елемент поля пошуку
 * */
function searchHandler(searchElem) {
    // Якщо довжина введеного тексту більше або дорівнює 3 символам
    if (searchElem.value.length >= 3) {
        // Записуємо введений текст в сховище
        appState.tableConfig.searchString = searchElem.value;

        // Заново перемальовуємо всю таблицю
        renderTable();
    } else if (appState.tableConfig.searchString) { // Якщо ж довжина менше 3 символів і в сховищі вже є записаний текст, то...
        // Очищуємо записаний текст для пошуку в сховищі
        appState.tableConfig.searchString = '';

        // Заново перемальовуємо всю таблицю
        renderTable();
    }
}

/*
 * Функція очищує форму для пошуку
 * */
function clearSearchForm() {
    // Очищуємо записаний текст для пошуку в сховищі
    appState.tableConfig.searchString = '';
    // Очищуємо введений в поле пошуку текст
    searchFormInput.value = '';

    // Заново перемальовуємо всю таблицю
    renderTable();
}

/*
 * Функція повністю очищує всі активні та збережені дані, включаючи із даними в LocalStorage сховищі
 * */
function clearAllData() {
    // Очищуємо LocalStorage сховище від збережених даних
    localStorage.removeItem('appState');

    // Перезавантажуємо сторінку - це очистить активні дані та оновить сторінку
    window.location.reload();
}

/*
 * Додаємо прослуховувач події 'load' на глобальний JS об'єкт сторінки window
 * Він виконає наступний JS код лише тоді і тільки тоді, коли сторінка та її ресурси повністю завантажаться, а сторінку відмалює браузер
 * */
window.addEventListener('load', (event) => {
    // Завантажуємо дані із LocalStorage сховища
    loadDataFromLocalStorage();

    // Пошук елемента button із id 'create'
    const btnCreate = document.querySelector('button#create');
    // Пошук елемента button із id 'remove'
    const btnRemove = document.querySelector('button#remove');
    // Пошук елемента div із id 'form-container'
    formContainer = document.querySelector('div#form-container');
    // Пошук елемента fieldset із id 'table-container'
    tableContainer = document.querySelector('fieldset#table-container');
    // Пошук елемента button із id 'remove-data'
    btnRemoveAllData = document.querySelector('.data-control-buttons button#remove-data');
    // Пошук елемента input із id 'search'
    searchFormInput = document.querySelector('.search-form input#search');

    // Додавання прослуховувача події 'click' на кнопку для створення форми
    btnCreate.addEventListener('click', (event) => {
        // Робимо кнопку неактивною після натискання, щоб унеможливити створення кількох форм
        btnCreate.disabled = true;

        // Очищуємо поле пошуку, щоб користувач точно побачив нові дані в таблиці
        clearSearchForm();
        // Створюємо нову форму
        createNewForm();
    });
    // Додавання прослуховувача події 'click' на кнопку видалення форми
    btnRemove.addEventListener('click', (event) => {
        // Після видалення форми робимо кнопку створення нової форми знову активною
        btnCreate.disabled = false;

        // Видаляємо форму
        removeForm();
    });
    // Додавання прослуховувача події 'click' на кнопку очищення всіх даних
    btnRemoveAllData.addEventListener('click', (event) => {
        // Очищуємо всі активні та збережені дані
        clearAllData();
    });
    // Додавання прослуховувача події 'input' на поле для пошуку
    searchFormInput.addEventListener('input', (event) => {
        searchHandler(event.target);
    });

    // Відмальовуємо всю таблицю вперше
    renderTable();
});
