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
const result = document.getElementById('result');


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

    result.classList.remove("hidden");
    uploadpart.classList.add("hidden");

    resultpart.classList.add("hidden");

    metadatalist.innerHTML = `<div class="nometadata">scanning metadata</div>`;

    try {
        await scanmetadata(file);
    } catch (error) {
        console.error(error);

        metadatalist.innerHTML = `<div class="nometadata">failed to scan metadata</div>`;

        updateScore(100, "couldn't detect matadata")
    }
}

async function scanmetadata(file) {
    if (typeof exif === "undefined") {
        throw new Error("exif is not loaded");
    }

    const data = await exiffr.parse(file, {
        gps: true,
        tiff: true,
        ifd0: true,
        exif: true,
        xmp: true,
        iptc: true,
    });

    displaymetadata(data || {});
}

function displaymetadata(data) {
    metadatalist.innerHTML = "";

    const interestingfields = [
        {
            key: "Make",
            label: "Camera Maanufacture",
            sensitive: false,
        },
        {
            key: "Model",
            label: "Device/Camera Model",
            sensitive: true
        },
        {
            key: "Datetimeoriginal",
            label: "Date Taken",
            sensitive: true
        },
        {
            key: "Createdate",
            label: "Creation Date",
            sensitive: true
        },
        {
            key: "Modifydate",
            label: "Last Modified Date",
            sensitive: true
        },
        {
            key: "GPSlatitude",
            label: "GPS Latitude",
            sensitive: true
        },
        {
            key: "GPSlongitude",
            label: "GPS Longitude",
            sensitive: true
        },
        {
            key: "GPSLatituderef",
            label: "GPS Latitude Reference",
            sensitive: true
        },
        {
            key: "GPSLongituderef",
            label: "GPS Longitude Reference",
            sensitive: true
        },
        {
            key: "software",
            label: "Editing Software",
            sensitive: false
        },
    ];

    let found = 0;
    let sensitiveCount = 0;

    for (const field of interestingfields) {
        const value = data[field.key];

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            continue;
        }

        found++;

        if (field.sensitive) {
            sensitiveCount++;
        }

        const row = document.createElement("div");

        row.className = `metadata-row ${field.sensitive ? "sensitive" : ""}`;

        row.innerHTML = `
        <span class="metadata-name">
        ${escapeHtml(field.label)}
        </span>`;

        metadatalist.appendChild(row);
    }






}
