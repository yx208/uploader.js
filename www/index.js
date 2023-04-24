const DEFAULT_CHUNK_SIZE = 1024 * 1024 * 2;

class ChunkFile {

    /** @type {number} */
    #chunkSize = 0;

    /** @type {File} */
    #file = null;

    /** @type {number} */
    #chunkCount = 0;

    /** @type {Blob[]} */
    #chunkBuffer = [];

    #iterIndex = 0;

    /**
     * @param {File} file
     * @param {number} chunkSize
     */
    constructor(file, chunkSize) {
        this.#chunkSize = chunkSize;
        this.#file = file;
        this.#chunkCount = Math.ceil(file.size / chunkSize);
        this.#preprocess();
    }

    #preprocess() {
        for (let i = 0; i < this.#chunkCount; i++) {
            const start = i * this.#chunkSize;
            const end = Math.min(start + this.#chunkSize, this.#file.size);
            this.#chunkBuffer.push(this.#file.slice(start, end));
        }
    }

    getSize() {
        return this.#chunkBuffer.reduce((a, b) => a + b.size, 0);
    }

    withIndex(index) {
        this.#iterIndex = index;
        return this;
    }

    /**
     * @param { (chunk: Blob, index: number) => void } handler
     */
    iter(handler) {
        for (; this.#iterIndex < this.#chunkCount; ++this.#iterIndex) {
            handler(this.#chunkBuffer[this.#iterIndex], this.#iterIndex);
        }
    }

}

class UploadScheduler {

    /** @type {ChunkFile} */
    #file = null;

    #chunkSize = 0;

    #current = 0;

    #uploadedChunks = null;

    #uploadFailedChunks = null;

    /**
     * @param file
     * @param chunkSize
     */
    constructor(file, chunkSize) {
        this.#file = (file instanceof ChunkFile)
            ? file
            : new ChunkFile(file, chunkSize);
        this.#chunkSize = chunkSize;
    }

    handle() {
        this.#file.withIndex(0).iter((chunk, index) => {

        });
    }

}

document.getElementById("file").onchange = function () {

    const file = this.files.item(0);
    this.value = null;

    const chunkFile = new ChunkFile(file, DEFAULT_CHUNK_SIZE);
    console.log(chunkFile.getSize());

}

