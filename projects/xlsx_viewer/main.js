window.onload = function () {
    // let uploadBtn = document.getElementById('upload');
    let FileUpload = document.getElementById('file-upload');

    FileUpload.addEventListener('change', handleFile, false);
};

function handleFile(event) {
    console.log(event);
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (evt) => {
        let data = new Uint8Array(evt.target.result);
        processFile(data);
    };
    reader.readAsArrayBuffer(file);
}

function processFile(data) {
    let workbook = XLSX.read(data, {
        type: 'array',
    });

    console.log(workbook);

    let jsonObj = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    let codeHTML = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);

    console.log(jsonObj);
    console.log(codeHTML);

    let outputViewer = document.getElementById('excel-viewer');
    outputViewer.innerHTML = codeHTML;
}


function upload() {
    let fileUploadInput = document.getElementById('file-upload');
    let regExp = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;

    if (regExp.test(fileUploadInput.value.toLowerCase())) {
        if (typeof (FileReader) !== 'undefined') {
            let reader = new FileReader();

            if (reader.readAsBinaryString) {
                reader.onload = (event) => {
                    processExcel(event.target.result);
                };
                reader.readAsBinaryString(fileUploadInput.files[0]);
            } else {
                reader.onload = function (event) {
                    let data = '';
                    let bytes = new Uint8Array(event.target.result);
                    for (let i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    processExcel(data);
                };
                reader.readAsArrayBuffer(fileUploadInput.files[0]);
            }
        } else {
            alert('This browser doesn\'t support HTML5.');
        }
    } else {
        alert('Please upload a valid Excel file.');
    }
}

function processExcel(data) {
    console.log(data);

    let workbook = XLSX.read(data, {
        types: 'binary',
    });
    let firstSheet = workbook.SheetNames[0];
    let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    console.log(excelRows);
    let table = document.createElement('table');
    table.style.borderWidth = '1px';
    let headerBlock = document.createElement('thead');
    table.appendChild(headerBlock);
    let rowH = headerBlock.insertRow(-1);
    let headerCell = document.createElement('th');
    let bodyBlock = document.createElement('tbody');
    table.appendChild(bodyBlock);
    let rowB = bodyBlock.insertRow(-1);
}
