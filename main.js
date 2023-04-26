const Koa = require("koa");
const { koaBody } = require("koa-body");
const koaStatic = require("koa-static");
const KoaRouter = require("koa-router");
const fsExtra = require("fs-extra");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.resolve(__dirname, "files");

const app = new Koa();
const router = new KoaRouter();

app.use(koaStatic(__dirname + '/www'));
app.use(koaBody({
    multipart: true
}));

router.get('/test', (ctx) => {
    ctx.body = "hello world";
});

router.post('/chunk-upload', async (ctx) => {

    // await sleep((Math.random() * 2000  % 2000) | 0);

    const file = ctx.request.files.chunk;
    const body = ctx.request.body;

    const fileHash = body.fileHash;
    const chunkHash = body.chunkHash;
    const chunkIndex = body.index;
    const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
    const chunkPath = path.resolve(chunkDir, chunkIndex);

    if (!fsExtra.pathExistsSync(chunkDir)) {
        await fsExtra.mkdirs(chunkDir);
    }

    await fsExtra.moveSync(file.filepath, chunkPath);

    ctx.body = "received file chunk";
});

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));

router.post('/chunk-merge', async (ctx) => {

    const fileHash = ctx.request.body.hash;
    const fileName = ctx.request.body.fileName;
    const chunkSize = Number(ctx.request.body.chunkSize);
    const fileDir = path.resolve(UPLOAD_DIR, fileHash);
    const chunks = fs.readdirSync(fileDir);
    const mergeFile = path.resolve(UPLOAD_DIR, fileName);
    chunks.sort((a, b) => a - b);

    for (const chunkName of chunks) {
        const chunkPath = path.resolve(fileDir, chunkName);
        fs.appendFileSync(mergeFile, fs.readFileSync(chunkPath));
        fs.unlinkSync(chunkPath);
    }

    fs.rmdirSync(fileDir);

    ctx.body = "received request";
});

router.get('/exist-chunks', (ctx) => {
    const fileHash = ctx.request.query.hash;
    const fileDir = path.resolve(UPLOAD_DIR, fileHash);
    const files = fs.readdirSync(fileDir);
    ctx.body = {
        data: files
    };
});

app.use(router.allowedMethods());
app.use(router.routes());

app.listen(3000);
