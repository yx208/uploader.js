/**
 * @param {Blob} chunk
 * @param {any} fileHash
 * @param {any} index
 * @returns {Promise}
 */
function uploadChunk(chunk, fileHash, index) {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('fileHash', fileHash);
    formData.append('chunkHash', fileHash + index);
    formData.append('index', index + '');
    formData.append('chunkSize', chunk.size + '');
    return axios({
        method: 'POST',
        url: 'http://localhost:3000/chunk-upload',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData
    });
}

function mergeChunkFile(hash, fileName, chunkSize) {
    const formData = new FormData();
    formData.append('hash', hash);
    formData.append('fileName', fileName);
    formData.append('chunkSize', chunkSize);
    return axios({
        method: 'POST',
        url: 'http://localhost:3000/chunk-merge',
        data: formData
    });
}
