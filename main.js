const Koa = require("koa");
const { koaBody } = require("koa-body");
const koaStatic = require("koa-static");
const KoaRouter = require("koa-router");
const fsExtra = require("fs-extra");
const path = require("path");

const UPLOAD_DIR = path.resolve(__dirname, "files");

console.log(fsExtra.pathExistsSync(UPLOAD_DIR));

const app = new Koa();
const router = new KoaRouter();

router.get('/test', (ctx) => {
    ctx.body = "hello world";
});

router.post('/chunk-upload', async (ctx) => {

    const file = ctx.request.files.chunk;
    const body = ctx.request.body;
    const fileHash = body.fileHash;
    const chunkHash = body.chunkHash;
    const chunkDir = `${UPLOAD_DIR}/${fileHash}`;
    const chunkIndex = body.index;
    const chunkPath = `${UPLOAD_DIR}/${fileHash}/${chunkIndex}`;

    if (fsExtra.pathExistsSync(chunkPath)) {
        await fsExtra.mkdirs(chunkPath);
    }

    await fsExtra.move(file.path, chunkPath);
    ctx.body = "received file chunk";
});

app.use(koaStatic(__dirname + '/www'));
app.use(router.allowedMethods());
app.use(router.routes());

app.listen(3000);
