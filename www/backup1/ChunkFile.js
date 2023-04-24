//
// function trimFileExt(name) {
//     const index = name.lastIndexOf('.');
//     return index === -1 ? name : name.slice(0, index);
// }
//
// class ChunkFile {
//
//     /** @type {Array<Blob>} */
//     // _buffer = [];
//
//     /** @type {Number} */
//     _iterIndex = 0;
//
//     /** @type {File} */
//     _file = null;
//
//     /** @type {Number} */
//     _chunkSize;
//
//     /** @type {Number} */
//     _chunkCount;
//
//     _hash = '';
//
//     /**
//      * @param {File} file
//      * @param {Number} chunkSize
//      */
//     constructor(file, chunkSize) {
//         this._file = file;
//         this._chunkSize = chunkSize;
//         this._chunkCount = Math.ceil(file.size / chunkSize);
//         this._hash = trimFileExt(file.name);
//     }
//
//     get hash() {
//         return this._hash;
//     }
//
//     get chunkCount() {
//         return this._chunkCount;
//     }
//
//     get fileName() {
//         return this._file.name;
//     }
//
//     // process() {
//     //     let current = 0;
//     //     const {type, size} = this._file;
//     //     while (current < size) {
//     //         const chunk = this._file.slice(current, current + this._chunkSize, type);
//     //         this._buffer.push(chunk);
//     //         current += this._chunkSize;
//     //     }
//     // }
//
//     /**
//      * @param index
//      * @return {Blob|null}
//      */
//     getChunk(index) {
//
//         if (index >= this._chunkCount) return null;
//
//         const start = index * this._chunkSize;
//         const end = Math.min(this._file.size, start + this._chunkSize);
//         return this._file.slice(start, end, this._file.type);
//     }
//
//     // /**
//     //  * @param { (chunk: Blob, index: Number) => void } fn
//     //  */
//     // iter(fn) {
//     //     this._buffer.forEach(fn);
//     // }
//     //
//     // /**
//     //  * 设置内部迭代指针的位置，使其指向特定的切片位置
//     //  * @param index
//     //  */
//     // setOffset(index) {
//     //
//     //     if (index >= this._buffer.length || index < 0) {
//     //         throw new Error("Point to an empty index.");
//     //     }
//     //
//     //     this._iterIndex = index;
//     // }
//
//     // [Symbol.iterator]() {
//     //     let index = 0;
//     //     return {
//     //         next: () => {
//     //             return (
//     //                 index < this._buffer.length
//     //                     ? {value: this._buffer[index++], done: false}
//     //                     : {done: true}
//     //             )
//     //         }
//     //     }
//     // }
// }
