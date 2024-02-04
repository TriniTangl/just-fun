class LuckyTicketClass {
    TICKET_SET = [];
    BEST_TICKET_SET = [];

    constructor() {
        this.generateSetOfTickets();
    }

    generateSetOfTickets() {
        for (let i = 1; i < 1000000; i++) {
            let digitsArr = this.convertToArray(i);

            if (this.isLucky(digitsArr)) {
                this.TICKET_SET.push(digitsArr.join(''));

                if (this.isBestLucky(digitsArr)) {
                    this.BEST_TICKET_SET.push(digitsArr.join(''));
                }
            }
        }
    }

    convertToArray(value) {
        let newValue = value.toString().split('').map(digit => Number(digit));

        while (newValue.length < 6) {
            newValue.unshift(0);
        }

        return newValue;
    }

    isLucky(arr) {
        let leftSum = 0;
        let rightSum = 0;

        arr.forEach((elem, index) => {
            if (index < arr.length / 2) {
                leftSum += elem;
            } else {
                rightSum += elem;
            }
        });

        return leftSum === rightSum;
    }

    isBestLucky(arr) {
        let lucky = false;

        for (let i = 0; i < arr.length / 2; i++) {
            lucky = arr[i] === arr[(arr.length - 1) - i];

            if (lucky === false) {
                break;
            }
        }

        return lucky;
    }

    getPreviousTicket(currentTicket) {
        let index = this.TICKET_SET.findIndex(elem => Number(elem) >= Number(currentTicket));

        return this.TICKET_SET[index - 1]
            ? this.TICKET_SET[index - 1]
            : undefined;
    }

    getNumberOfTicketToPrevious(currentTicket) {
        let previousTicket = this.getPreviousTicket(currentTicket);

        return Number(currentTicket) - Number(previousTicket)
            ? Number(currentTicket) - Number(previousTicket)
            : undefined;
    }

    getNextTicket(currentTicket) {
        let index = this.TICKET_SET.findIndex(elem => Number(elem) >= Number(currentTicket));

        return !(Number(this.TICKET_SET[index]) === Number(currentTicket))
            ? this.TICKET_SET[index]
            : this.TICKET_SET[index + 1]
                ? this.TICKET_SET[index + 1]
                : undefined;
    }

    getNumberOfTicketToNext(currentTicket) {
        let nexTicket = this.getNextTicket(currentTicket);

        return Number(nexTicket) - Number(currentTicket)
            ? Number(nexTicket) - Number(currentTicket)
            : undefined;
    }
}

const LuckyTicket = new LuckyTicketClass();

window.onload = () => {
    document.getElementById('form').addEventListener('submit', processingData);
    document.getElementById('ticket-number').addEventListener('input', validation);
};

function validation(event) {
    let inputEl = event.target;
    let button = document.getElementById('submit');

    inputEl.value = inputEl.value.replace(/\e[^0-9]/g, '').slice(0, 6);

    if (inputEl.value.length === 6 && Number(inputEl.value) >= 1 && Number(inputEl.value) <= 999999) {
        inputEl.classList.add('valid');
        inputEl.classList.remove('invalid');
        button.removeAttribute('disabled');
    } else {
        inputEl.classList.add('invalid');
        inputEl.classList.remove('valid');
        button.setAttribute('disabled', '');
    }
}

function processingData(event) {
    let inputNumber = event.target.querySelector('input').value;
    let outputStr = `Your ticket: <b>${ inputNumber }</b><br>`;

    outputStr += `Lucky ticket: <b>${ LuckyTicket.isLucky(LuckyTicket.convertToArray(inputNumber)) }</b><br>`;

    if (LuckyTicket.isBestLucky(LuckyTicket.convertToArray(inputNumber))) {
        outputStr += `VERY LUCKY ticket: <b>true</b><br>`;
    }

    outputStr += `Previous lucky ticket: <b>${ LuckyTicket.getPreviousTicket(inputNumber)
        ? LuckyTicket.getPreviousTicket(inputNumber)
        : 'doesn\'t exist' }</b><br>`;

    if (LuckyTicket.getNumberOfTicketToPrevious(inputNumber)) {
        outputStr += `Ticket before you: <b>${ LuckyTicket.getNumberOfTicketToPrevious(inputNumber) }</b><br>`;
    }

    outputStr += `Next lucky ticket: <b>${ LuckyTicket.getNextTicket(inputNumber)
        ? LuckyTicket.getNextTicket(inputNumber)
        : 'doesn\'t exist' }</b><br>`;

    if (LuckyTicket.getNumberOfTicketToNext(inputNumber)) {
        outputStr += `Ticket after you: <b>${ LuckyTicket.getNumberOfTicketToNext(inputNumber) }</b><br>`;
    }

    event.target.parentElement.querySelector('output').innerHTML = outputStr;
    event.preventDefault();
}
