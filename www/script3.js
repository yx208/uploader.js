const DEFAULT_CHUNK_SIZE = 1024 * 1024 / 2;
const state = {
    percent: '',
    pause: false,
    uploadedChunk: 0,
}

/** @type {UploadScheduler} */
let scheduler;

document.getElementById("file").onchange = function () {

    const file = this.files.item(0);
    this.value = null;

    scheduler = new UploadScheduler(file);
    scheduler.run();
    scheduler.onFinish = (file) => {
        mergeChunkFile(file.hash, file.fileName, DEFAULT_CHUNK_SIZE);
    }

}

document.getElementById('pause').onclick = () => {
    console.log('pause');
    scheduler.pause();
}

document.getElementById('resume').onclick = () => {
    console.log('resume');
    scheduler.resume();
}
