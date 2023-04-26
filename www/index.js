const DEFAULT_CHUNK_SIZE = 1024 * 1024 * 10;

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

    #hash = '';

    /**
     * @param {File} file
     * @param {number} chunkSize
     * @param {string} hash
     */
    constructor(file, chunkSize, hash) {
        this.#chunkSize = chunkSize;
        this.#file = file;
        this.#hash = hash;
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

    /**
     * @param {number} index
     * @returns {Blob|null}
     */
    chunk(index) {
        if (index < 0 || index > this.#chunkCount) return null;
        return this.#chunkBuffer[index];
    }

    withIndex(index) {
        this.#iterIndex = index;
        return this;
    }

    get chunkCount() {
        return this.#chunkCount;
    }

    get hash() {
        return this.#hash;
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

    #uploadedChunks = null;

    #uploadFailedChunks = null;

    #iterIndex = 0;

    #concurrency = 4;

    #pause = false;

    /**
     * 接收返回一个 promise，
     * @type { (chunk: Blob, index: number, chunkFile?: ChunkFile) => Promise }
     */
    onFetch = null;

    /**
     * @param {Object} options
     * @param {File} options.file
     * @param {number} options.chunkSize
     * @param {number} options.concurrency
     * @param {string} options.hash
     */
    constructor(options) {
        this.#chunkSize = options.chunkSize;
        this.#concurrency = options.concurrency;
        this.#file = new ChunkFile(options.file, options.chunkSize, options.hash);
    }

    async handle() {
        const taskQueue = new Set();
        for (let i = this.#iterIndex; i < this.#file.chunkCount; ++i) {

            if (taskQueue.size >= this.#concurrency) {
                await Promise.race(taskQueue);
            }

            const chunk = this.#file.chunk(i);
            if (chunk) {
                const task = this.onFetch(chunk, i, this.#file);
                taskQueue.add(task);
                task.then(() => taskQueue.delete(task));
            }
        }

        await Promise.allSettled(taskQueue);
    }

    get fileHash() {
        return this.#file.hash;
    }

    withIndex(index) {
        this.#iterIndex = index;
        return this;
    }

    pause() {

    }

    resume() {

    }

}

/**
 * @param {File} file
 * @param {number} chunkSize
 * @returns {Promise<UploadScheduler>}
 */
async function createScheduler(file, chunkSize) {
    const hash = await hash256(file);
    return new UploadScheduler({
        file,
        hash,
        chunkSize,
        concurrency: 4
    });
}

document.getElementById("file").onchange = async function () {

    const file = this.files.item(0);
    this.value = null;

    const scheduler = await createScheduler(file, DEFAULT_CHUNK_SIZE);
    const fileHash = scheduler.fileHash;
    scheduler.onFetch = (chunk, index) => {
        return uploadChunk(chunk, fileHash, index);
    }
    await scheduler.handle();

    mergeChunkFile(fileHash, file.name, DEFAULT_CHUNK_SIZE);

}
