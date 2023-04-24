//
// class UploadScheduler {
//
//     /** @type { (file: ChunkFile) => void } */
//     onFinish = null;
//
//     /** @type {number} */
//     _chunkSize = 0;
//
//     /**
//      * @param {File} file
//      * @param chunkSize
//      */
//     constructor(file, chunkSize) {
//         this._chunkSize = chunkSize;
//         this.file = new ChunkFile(file, chunkSize);
//         this.uploadedChunks = new Set();
//         this.uploadFiledChunks = new Set();
//         this.taskQueue = new TaskQueue();
//         this.currentChunk = 0;
//     }
//
//     /**
//      * 开始上传
//      */
//     run() {
//         this.taskQueue.onFetch = () => {
//
//             const chunk = this.file.getChunk(this.currentChunk);
//             if (!chunk) return null;
//
//             const taskIndex = this.currentChunk++;
//             return {
//                 task: uploadChunk(chunk, this.file.hash, taskIndex),
//                 onFailed: () => {
//                     this.uploadFiledChunks.add(taskIndex);
//                 },
//                 onCompleted: () => {
//                     this.uploadedChunks.add(taskIndex);
//                     // 每完成一片，检查是否完成上传
//                     if (this.file.chunkCount === this.uploadedChunks.size) {
//                         this.onFinish(this.file);
//                     }
//                 }
//             }
//         }
//         this.taskQueue.handle();
//     }
//
//     /**
//      * 尝试重新上传失败的片
//      */
//     tryReUpload() {
//
//     }
//
//     /**
//      * 暂停
//      */
//     pause() {
//         this.taskQueue.pause();
//     }
//
//     /**
//      * 继续
//      */
//     resume() {
//
//     }
//
// }
//
// /**
//  * @param {Blob} chunk
//  * @param {string} hash
//  * @param {number} index
//  * @returns {Promise}
//  */
// function uploadChunk(chunk, hash, index) {
//     const formData = new FormData();
//     formData.append('chunk', chunk);
//     formData.append('fileHash', hash);
//     formData.append('chunkHash', hash + index);
//     formData.append('index', index + '');
//     return axios({
//         method: 'POST',
//         url: 'http://localhost:3000/chunk-upload',
//         headers: {
//             "Content-Type": "multipart/form-data"
//         },
//         data: formData
//     });
// }
//
// function mergeChunkFile(hash, fileName, chunkSize) {
//     const formData = new FormData();
//     formData.append('hash', hash);
//     formData.append('fileName', fileName);
//     formData.append('chunkSize', chunkSize);
//     return axios({
//         method: 'POST',
//         url: 'http://localhost:3000/chunk-merge',
//         data: formData
//     });
// }
