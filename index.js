var result = document.querySelector('#result')
var file = document.querySelector('#file')

var folder = /(hw)\w+_[b|r|d|e]\w+/g
var items = ['Makefile', 'report.pdf', 'src', 'inc']

file.addEventListener('change', function (evt) {
    result.innerHTML = ''
    items = ['Makefile', 'report.pdf', 'src', 'inc']

    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }
});

function handleFile(f) {

    var title = ''
    var fileContent = ''

    var dateBefore = new Date();
    JSZip.loadAsync(f)
        .then(function (zip) {
            var dateAfter = new Date();
            title = `<h4>${f.name} <span class="hint">(loaded in ${dateAfter - dateBefore} ms)</span></h4>`

            zip.forEach(function (relativePath, zipEntry) {
                fileContent += `<li>${zipEntry.name}</li>`
                checkFormat(zipEntry.name)
            })
        }, function (e) {
            result.innerHTML = `<div>Error reading ${f.name}: ${e.message}</div>`
        })
        .then(function () { result.innerHTML = title + `<ul>${fileContent}</ul>` })
        .then(function () {
            if (folder.test(f.name) && items.length === 0) {
                alert('format correct')
            }
            else {
                let message = '格式不正確：'
                message += !folder.test(f.name) ? '壓縮檔名稱錯誤    ' : ''
                message += items.length !== 0 ? '資料夾結構錯誤' : ''
                alert(message)
            }
        })
}


function checkFormat(name) {
    var file = name.split('/')

    if (items.includes(file[1])) {
        items.splice(items.indexOf(file[1]), 1)
    }
}