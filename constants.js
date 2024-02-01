export { FORM_DATA, FORM_CONFIG, TABLE_COLUMNS_CONFIG, DEFAULT_CURRENT_CHOICE };

const FORM_DATA = {
    manufacturers: [
        { name: 'Ford', price: 20000 },
        { name: 'Renault', price: 12000 },
        { name: 'Toyota', price: 18000 },
        { name: 'Volkswagen', price: 13000 },
        { name: 'Volvo', price: 24000 },
    ],
    productionYears: [
        { name: '2023', price: 27000 },
        { name: '2022', price: 20000 },
        { name: '2021', price: 14000 },
        { name: '2020', price: 10000 },
        { name: '2019', price: 4000 },
    ],
    paints: [
        { name: 'Black', price: 1000 },
        { name: 'Blue', price: 1200 },
        { name: 'Red', price: 1200 },
        { name: 'Silver', price: 1500 },
        { name: 'White', price: 1000 },
    ],
    interiors: [
        { name: 'Black', price: 2000 },
        { name: 'Brown', price: 5000 },
        { name: 'Gray', price: 2500 },
    ],
    models: [
        { name: 'Escape', price: 11000, manufacturer: 'Ford' },
        { name: 'Explorer', price: 12000, manufacturer: 'Ford' },
        { name: 'F-150', price: 60000, manufacturer: 'Ford' },
        { name: 'Ranger', price: 13000, manufacturer: 'Ford' },
        { name: 'Focus', price: 2000, manufacturer: 'Ford' },
        { name: 'Clio', price: 500, manufacturer: 'Renault' },
        { name: 'Fluence', price: 100, manufacturer: 'Renault' },
        { name: 'Koleos', price: 10400, manufacturer: 'Renault' },
        { name: 'Captur', price: 8000, manufacturer: 'Renault' },
        { name: 'Megane', price: 5500, manufacturer: 'Renault' },
        { name: 'Highlander', price: 27000, manufacturer: 'Toyota' },
        { name: 'Corolla', price: 4600, manufacturer: 'Toyota' },
        { name: 'Tacoma', price: 18900, manufacturer: 'Toyota' },
        { name: 'Camry', price: 15500, manufacturer: 'Toyota' },
        { name: 'RAV4', price: 31000, manufacturer: 'Toyota' },
        { name: 'Golf R', price: 3300, manufacturer: 'Volkswagen' },
        { name: 'ID.4', price: 18800, manufacturer: 'Volkswagen' },
        { name: 'Jetta', price: 14500, manufacturer: 'Volkswagen' },
        { name: 'Taos', price: 34000, manufacturer: 'Volkswagen' },
        { name: 'Tiguan', price: 37000, manufacturer: 'Volkswagen' },
        { name: 'S90', price: 6000, manufacturer: 'Volvo' },
        { name: 'V90', price: 17000, manufacturer: 'Volvo' },
        { name: 'V60', price: 12000, manufacturer: 'Volvo' },
        { name: 'XC90', price: 27000, manufacturer: 'Volvo' },
        { name: 'XC40', price: 21000, manufacturer: 'Volvo' },
    ],
};

const FORM_CONFIG = {
    tag: 'form',
    children: [
        {
            tag: 'fieldset',
            children: [
                { tag: 'legend', text: 'ПІБ' },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'Прізвище:',
                            attributes: [{ name: 'for', value: 'second-name' }],
                        },
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'text' },
                                { name: 'name', value: 'second-name' },
                                { name: 'id', value: 'second-name' },
                                { name: 'placeholder', value: 'Введіть прізвище...' },
                                { name: 'data-state-field', value: 'secondName' },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'Імʼя:',
                            attributes: [{ name: 'for', value: 'first-name' }],
                        },
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'text' },
                                { name: 'name', value: 'first-name' },
                                { name: 'id', value: 'first-name' },
                                { name: 'placeholder', value: 'Введіть імʼя...' },
                                { name: 'data-state-field', value: 'firstName' },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'По батькові:',
                            attributes: [{ name: 'for', value: 'last-name' }],
                        },
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'text' },
                                { name: 'name', value: 'last-name' },
                                { name: 'id', value: 'last-name' },
                                { name: 'placeholder', value: 'Введіть по батькові...' },
                                { name: 'data-state-field', value: 'lastName' },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    text: 'Введіть, будь ласка, з великої літери.',
                    attributes: [{ name: 'class', value: 'helper' }],
                },
            ],
        },
        {
            tag: 'fieldset',
            children: [
                { tag: 'legend', text: 'Дані для доступу' },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'Email:',
                            attributes: [{ name: 'for', value: 'email' }],
                        },
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'email' },
                                { name: 'name', value: 'email' },
                                { name: 'id', value: 'email' },
                                { name: 'placeholder', value: 'someone@example.com' },
                                { name: 'data-state-field', value: 'email' },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'Password:',
                            attributes: [{ name: 'for', value: 'password' }],
                        },
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'password' },
                                { name: 'name', value: 'password' },
                                { name: 'id', value: 'password' },
                                { name: 'placeholder', value: 'Password' },
                                { name: 'data-state-field', value: 'password' },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    text: 'Пароль має включати великі/малі літери та цифри.',
                    attributes: [{ name: 'class', value: 'helper' }],
                },
            ],
        },
        {
            tag: 'fieldset',
            children: [
                { tag: 'legend', text: 'Виробник / Рік' },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'Виробник:',
                            attributes: [{ name: 'for', value: 'manufacturer' }],
                        },
                        {
                            tag: 'select',
                            attributes: [
                                { name: 'name', value: 'manufacturer' },
                                { name: 'id', value: 'manufacturer' },
                                { name: 'data-state-field', value: 'manufacturer' },
                            ],
                            children: [
                                {
                                    tag: 'option',
                                    text: 'Виберіть виробника...',
                                    attributes: [
                                        { name: 'value', value: '' },
                                        { name: 'disabled', value: '' },
                                        { name: 'selected', value: '' },
                                    ],
                                },
                                {
                                    tag: 'option',
                                    text: '',
                                    isTemplate: true,
                                    dataSrc: 'manufacturers',
                                    attributes: [{ name: 'value', value: '' }],
                                },
                            ],
                        },
                    ],
                },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'row l-variant' }],
                    children: [
                        {
                            tag: 'label',
                            text: 'Рік:',
                            attributes: [{ name: 'for', value: 'production-year' }],
                        },
                        {
                            tag: 'select',
                            attributes: [
                                { name: 'name', value: 'production-year' },
                                { name: 'id', value: 'production-year' },
                                { name: 'data-state-field', value: 'productionYear' },
                            ],
                            children: [
                                {
                                    tag: 'option',
                                    text: 'Виберіть рік...',
                                    attributes: [
                                        { name: 'value', value: '' },
                                        { name: 'disabled', value: '' },
                                        { name: 'selected', value: '' },
                                    ],
                                },
                                {
                                    tag: 'option',
                                    text: '',
                                    isTemplate: true,
                                    dataSrc: 'productionYears',
                                    attributes: [{ name: 'value', value: '' }],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            tag: 'fieldset',
            children: [
                { tag: 'legend', text: 'Колір' },
                {
                    tag: 'div',
                    text: 'Кузов',
                    attributes: [{ name: 'class', value: 'helper' }],
                },
                {
                    tag: 'div',
                    isTemplate: true,
                    dataSrc: 'paints',
                    attributes: [{ name: 'class', value: 'row r-variant' }],
                    children: [
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'radio' },
                                { name: 'name', value: 'paint' },
                                { name: 'id', value: 'paint' },
                                { name: 'value', value: '' },
                                { name: 'data-state-field', value: 'paint' },
                            ],
                        },
                        {
                            tag: 'label',
                            text: '',
                            attributes: [{ name: 'for', value: 'paint' }],
                        },
                    ],
                },
                {
                    tag: 'div',
                    text: 'Салон',
                    attributes: [{ name: 'class', value: 'helper' }],
                },
                {
                    tag: 'div',
                    isTemplate: true,
                    dataSrc: 'interiors',
                    attributes: [{ name: 'class', value: 'row r-variant' }],
                    children: [
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'radio' },
                                { name: 'name', value: 'interior' },
                                { name: 'id', value: 'interior' },
                                { name: 'value', value: '' },
                                { name: 'data-state-field', value: 'interior' },
                            ],
                        },
                        {
                            tag: 'label',
                            text: '',
                            attributes: [{ name: 'for', value: 'interior' }],
                        },
                    ],
                },
            ],
        },
        {
            tag: 'fieldset',
            children: [
                { tag: 'legend', text: 'Модель(і) / Вартість' },
                {
                    tag: 'div',
                    isTemplate: true,
                    dataSrc: 'models',
                    attributes: [{ name: 'class', value: 'row r-variant' }],
                    children: [
                        {
                            tag: 'input',
                            attributes: [
                                { name: 'type', value: 'checkbox' },
                                { name: 'name', value: 'model' },
                                { name: 'id', value: 'model' },
                                { name: 'value', value: '' },
                                { name: 'data-state-field', value: 'model' },
                            ],
                        },
                        {
                            tag: 'label',
                            text: '',
                            attributes: [{ name: 'for', value: 'model' }],
                        },
                    ],
                },
                {
                    tag: 'div',
                    attributes: [{ name: 'class', value: 'helper' }],
                    children: [
                        {
                            tag: 'strong',
                            text: 'Вартість: ',
                            children: [
                                {
                                    tag: 'ins',
                                    text: `\xa0\xa0\xa0\xa0\xa0`,
                                    attributes: [{ name: 'id', value: 'final-price' }],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const TABLE_COLUMNS_CONFIG = [
    { name: 'ID', field: 'id', sortType: 'number' },
    { name: 'ПРІЗВИЩЕ', field: 'secondName', sortType: 'string' },
    { name: 'ІМʼЯ', field: 'firstName', sortType: 'string' },
    { name: 'ПО БАТЬКОВІ', field: 'lastName', sortType: 'string' },
    { name: 'EMAIL', field: 'email', sortType: 'string' },
    { name: 'PASSWORD', field: 'password', sortType: 'string' },
    { name: 'ВИРОБНИК', field: 'manufacturer', sortType: 'string' },
    { name: 'РІК ВИРОБНИЦТВА', field: 'productionYear', sortType: 'number' },
    { name: 'КОЛІР КУЗОВА', field: 'paint', sortType: 'string' },
    { name: 'КОЛІР САЛОНУ', field: 'interior', sortType: 'string' },
    { name: 'МОДЕЛЬ(І)', field: 'model', sortType: 'string' },
    { name: 'ВАРТІСТЬ', field: 'price', sortType: 'number' },
];

const DEFAULT_CURRENT_CHOICE = {
    id: 0,
    secondName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    manufacturer: '',
    productionYear: '',
    paint: '',
    interior: '',
    model: [],
    price: 0,
};
