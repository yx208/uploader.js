// const DEFAULT_CHUNK_SIZE = 1024 * 1024 * 2;
// const state = {
//     percent: '',
//     pause: false,
//     uploadedChunk: 0,
// }
//
// /** @type {UploadScheduler} */
// let scheduler;
// let chunks = [];
// document.getElementById("file").onchange = function () {
//
//     const file = this.files.item(0);
//     this.value = null;
//
//     chunks = [];
//     const chunkNum = Math.ceil(file.size / DEFAULT_CHUNK_SIZE);
//     console.time();
//     for (let i = 0; i < chunkNum; i++) {
//         const start = i * DEFAULT_CHUNK_SIZE;
//         const end = start + DEFAULT_CHUNK_SIZE;
//         const chunk = file.slice(start, end, file.type);
//         chunks.push(chunk);
//     }
//     console.timeEnd();
//
//     // scheduler = new UploadScheduler(file, DEFAULT_CHUNK_SIZE);
//     // scheduler.run();
//     // scheduler.onFinish = (file) => {
//     //     mergeChunkFile(file.hash, file.fileName, DEFAULT_CHUNK_SIZE);
//     //     scheduler = null;
//     // }
//
// }
//
// document.getElementById('pause').onclick = () => {
//     console.log('pause');
//     scheduler.pause();
// }
//
// document.getElementById('resume').onclick = () => {
//     console.log('resume');
//     scheduler.resume();
// }
