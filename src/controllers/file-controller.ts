import CloudConvert from "cloudconvert";
import app from "../app";
const fs = require('fs');
const nodeBase64 = require('nodejs-base64-converter');
const Aws = require("aws-sdk");

const express = require('express');
const router = express.Router();

router.get("/get-file", async (req, res) => {
    // @ts-ignore
    const cloudConvert = new CloudConvert(process.env.CLOUD_CONVERT_KEY);
    try {
        // @ts-ignore
        let job = await cloudConvert.jobs.create({
            "tasks": {
                "import-1": {
                    "operation": "import/s3",
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET,
                    "key": "my-file.docx"
                },
                "task-1": {
                    "operation": "convert",
                    "input_format": "docx",
                    "output_format": "html",
                    "engine": "office",
                    "input": [
                        "import-1"
                    ]
                },
                "export-1": {
                    "operation": "export/url",
                    "input": [
                        "task-1"
                    ],
                }
            }
        });
        const https = require('https');
        job = await cloudConvert.jobs.wait(job.id);
        const exportTask: any = job.tasks.filter(
            task => task.operation === 'export/url' && task.status === 'finished'
        )[0];
        const file = exportTask.result.files[0];

        const writeStream = fs.createWriteStream(file.filename);

        console.log(file.url);
        https.get(file.url, function (response) {
            response.pipe(writeStream);
        });

        await new Promise((resolve, reject) => {
            writeStream.on('finish', () => { resolve(true) });
            writeStream.on('error', reject);
        });

        const path = require("path");
        const absolutePath = path.resolve('./my-file.html');
        res.status(200).sendFile(absolutePath);
    } catch (e) {
        res.status(400).json({status: 400, message: "Converting docx to html failed! " + e})
    }
});

router.post("/html-upload", async (req, res) => {
    // @ts-ignore
    const cloudConvert = new CloudConvert(process.env.CLOUD_CONVERT_KEY);

    try {
        // @ts-ignore
        await cloudConvert.jobs.create({
            "tasks": {
                "import-1": {
                    "operation": "import/raw",
                    "file": req.body.file,
                    "filename": "my-file.html"
                },
                "export-1": {
                    "operation": "export/s3",
                    "input": [
                        "import-1"
                    ],
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET
                }
            }
        });

        await cloudConvert.jobs.create({
            "tasks": {
                "import-1": {
                    "operation": "import/s3",
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET,
                    "key": "my-file.html"
                },
                "task-1": {
                    "operation": "convert",
                    "input_format": "html",
                    "output_format": "docx",
                    "engine": "office",
                    "input": [
                        "import-1"
                    ],
                    "embed_images": false
                },
                "export-1": {
                    "operation": "export/s3",
                    "input": [
                        "task-1"
                    ],
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET
                }
            }
        });
        res.status(200).json({status: 200, message: "Converting html to docx succeeded!"})
    } catch (e) {
        res.status(400).json({status: 400, message: "Converting html to docx failed! " + e})
    }
});

router.get("/get-file/:fileName", async (req, res) => {
    console.log(req.params.fileName)
    // @ts-ignore
    const cloudConvert = new CloudConvert(process.env.CLOUD_CONVERT_KEY);
    try {
        // @ts-ignore
        let job = await cloudConvert.jobs.create({
            "tasks": {
                "import-1": {
                    "operation": "import/s3",
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET,
                    "key": req.params.fileName + ".html"
                },
                "export-1": {
                    "operation": "export/url",
                    "input": [
                        "import-1"
                    ],
                }
            }
        });
        const https = require('https');
        job = await cloudConvert.jobs.wait(job.id);
        const exportTask: any = job.tasks.filter(
            task => task.operation === 'export/url' && task.status === 'finished'
        )[0];
        console.log(exportTask)
     //   if (exportTask) {
            const file = exportTask.result.files[0];

            const writeStream = fs.createWriteStream(file.filename);

            console.log(file.url);
            https.get(file.url, function (response) {
                response.pipe(writeStream);
            });

            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => { resolve(true) });
                writeStream.on('error', reject);
            });

            const path = require("path");
            const absolutePath = path.resolve('./' + req.params.fileName + '.html');
            res.status(200).sendFile(absolutePath);
      //  } else {
      //      res.send(200, 'emptyFile')
      //  }

    } catch (e) {
        res.status(400).json({status: 400, message: "Converting docx to html failed! " + e})
    }
});

router.post("/html-upload/:fileName", async (req, res) => {
    console.log(req.params.fileName)
    // @ts-ignore
    const cloudConvert = new CloudConvert(process.env.CLOUD_CONVERT_KEY);

    try {
        // @ts-ignore
        await cloudConvert.jobs.create({
            "tasks": {
                "import-1": {
                    "operation": "import/raw",
                    "file": req.body.file,
                    "filename": req.params.fileName + ".html"
                },
                "export-1": {
                    "operation": "export/s3",
                    "input": [
                        "import-1"
                    ],
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET
                }
            }
        });

        await cloudConvert.jobs.create({
            "tasks": {
                "import-1": {
                    "operation": "import/s3",
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET,
                    "key": req.params.fileName + ".html"
                },
                "task-1": {
                    "operation": "convert",
                    "input_format": "html",
                    "output_format": "docx",
                    "engine": "office",
                    "input": [
                        "import-1"
                    ],
                    "embed_images": false
                },
                "export-1": {
                    "operation": "export/s3",
                    "input": [
                        "task-1"
                    ],
                    "bucket": "app.items.uploads",
                    "region": "eu-central-1",
                    "access_key_id": process.env.AWS_KEY,
                    "secret_access_key": process.env.AWS_SECRET
                }
            }
        });
        res.status(200).json({status: 200, message: "Converting html to docx succeeded!"})
    } catch (e) {
        res.status(400).json({status: 400, message: "Converting html to docx failed! " + e})
    }
});

module.exports = router;
