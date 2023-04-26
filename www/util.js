
/**
 * @param {File} file
 */
function hash256(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            /** @type {ArrayBuffer} */
            const fileData = event.target.result;
            crypto.subtle.digest('SHA-256', fileData).then((hashBuffer) => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                resolve(hashHex);
            }).catch(reject);
        }
        reader.readAsArrayBuffer(file);
    });
}
