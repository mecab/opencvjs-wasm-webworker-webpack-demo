// opencv.js tries to locate the wasms from the root by default.
// We changes the location by defining Module object.
//
// See: https://kripken.github.io/emscripten-site/docs/api_reference/module.html#Module.locateFile

global.Module = {
    locateFile: (path) => {
        const url = `/assets/wasm/${path}`;
        log(`⬇️Downloading wasm from ${url}`);
        return url;
    }
};

const cv = require('./opencv.js');
let classifier = null;

cv.onRuntimeInitialized = async () => {
    log('📦OpenCV runtime loaded');
    init();
};

async function createFileFromUrl(path, url) {
    // Small function to make a remote file visible from emscripten module.

    log(`⬇️ Downloading additional file from ${url}.`);
    const res = await self.fetch(url);
    if (!res.ok) {
        throw new Error(`Response is not OK (${res.status} ${res.statusText} for ${url})`);
    }
    const buffer = await res.arrayBuffer();
    const data = new Uint8Array(buffer);
    cv.FS_createDataFile('/', path, data, true, true, false);
    log(`📦${url} downloaded. Mounted on /${path}`);
}

async function init() {
    await createFileFromUrl('haarcascade_frontalface_default.xml',
                            '/static/data/haarcascade_frontalface_default.xml');

    classifier = new cv.CascadeClassifier();
    classifier.load('haarcascade_frontalface_default.xml');

    // Let the UI that the module finished initialization
    self.postMessage({ type: 'init' });

    self.addEventListener('message', ({ data }) => {
        if (data.type === 'frame') {
            const faces = detectFaces(data.imageData);
            self.postMessage({ type: 'detect_faces', faces: faces });
        }
    });
}

function detectFaces(imageData) {
    const img = cv.matFromImageData(imageData);
    const imgGray = new cv.Mat();

    const rect = [];
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const msize = new cv.Size(0, 0);
    classifier.detectMultiScale(imgGray, faces, 1.1, 3, 0, msize, msize);

    for (let i = 0; i < faces.size(); i++) {
        rect.push(faces.get(i));
    }

    img.delete();
    faces.delete();
    imgGray.delete();

    return rect;
}

function log(args) {
    self.postMessage({ type: 'log', args: Array.from(arguments) });
}
