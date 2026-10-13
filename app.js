const fileinput = document.getElementById('fileinput');
const choosebutton = document.getElementById('choosebutton');
const uploadpart = document.getElementById('uploadpart');
const resultpart = document.getElementById('resultpart');
const preview = document.getElementById('preview');
const imagename = document.getElementById('imagename');
const imagesize = document.getElementById('imagesize');
const score = document.getElementById('score');
const scoretext = document.getElementById('scoretext');
const metadatavalue = document.getElementById('metadatavalue');
const metadatalist = document.getElementById('metadatalist');
const clearbutton = document.getElementById('clearbutton');
const downloadbutton = document.getElementById('downloadbutton');
const resetbutton = document.getElementById('resetbutton');


let imagefile = null;
let imageurl = null;

choosebutton.addEventListener('click', () => {
    fileinput.click();
});

fileinput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        processimage(file);
    }
});

async function processimage(file) {
    if (!file.type.startswidth("image/")) {
        alert("please select an image.")
    }

    imagefile = file;

    if (imageurl) {
        URL.revokeObjectURL(imageurl);
    }

    imageurl = URL.createObjectURL(file);

    preview.src = imageurl;

    imagename.textContent = file.name;
    imagesize.textContent = formatBytes(file.size);

    result

}