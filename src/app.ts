import express = require("express");
import bodyParser from "body-parser";
import container from "./injection-container";
import { scopePerRequest } from "awilix-express";
import DatabaseConnector from "./database-connector";
import logger from "./logger";
import helmet from "helmet";
import contextService from "request-context";
import { Context } from "./context";
import { TestController } from "./controllers/test-controller";
import { ReadyComponentController } from "./controllers/ready-component-controller";
import { StyleController } from "./controllers/style-constroller";
const fs = require('fs');

import CloudConvert from 'cloudconvert';
const nodeBase64 = require('nodejs-base64-converter');
const Aws = require("aws-sdk");

const app: express.Application = express();
const upload = require("./services/image-upload-service");

app.use(helmet());

new DatabaseConnector().connect();

app.use(contextService.middleware("request"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  if (!req.originalUrl || req.originalUrl === "/" || req.originalUrl === "") {
    return;
  } else {
    logger.info("Rest call started");
    logger.info(`Type: ${req.method}, URL: ${req.originalUrl}`);
    logger.info(`Req body: ${JSON.stringify(req.body)}`);
    next();
  }
});

app.use((req, res, next) => {
  contextService.set("request:context", new Context(new Date()));
  next();
});

app.use(scopePerRequest(container));

app.use("/api/test", new TestController().router);
app.use("/api/ready-components", new ReadyComponentController().router);
app.use("/api/styles", new StyleController().router);

app.post("/api/image-upload", upload.any(), (req, res) => {
  res.send({ image: req.file });
});

app.get("/api/get-file", async (req, res) => {
  const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjEwZGM0NDk5YjI2MDY1YjJkMzI1NWJmZmM1NjFiMDM0MTA0MjBkNDI3NzcwNmFlMzlkMDVlODg5NGM4ODUwNWY0NzM3NjU0MzRmZTk4MDQiLCJpYXQiOjE2MTkzNTkyNDQuMTA1MTA4LCJuYmYiOjE2MTkzNTkyNDQuMTA1MTExLCJleHAiOjQ3NzUwMzI4NDQuMDQ3OTc4LCJzdWIiOiI1MDYxMzg2NSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSJdfQ.R-qesO7R3l_eWddzHDtvq-kaPjAJSL4Xt2tNLfAKUZVyaQPrEoqG-AUaoSjn8yovvUbNC3rdrAr3zYqEIllsPdvxsbde8ZnexYT3IRXb7emHrWfz2nBDqHeDByf3b5sdC-cHFoM5wQ2a0Tps08SX7j5cw4Ud4WAqOgR_R6dtAjF9E8QDz62m-4hsgyACET-3e0x9ocnx_VU85rkjnTvpM6nGUNtOwbxVtMPuf7keK51c5jTBpmtUzn6b3R7fLJ2BnUzFuyEniiwjcOS4k0gNWhMFbqganmZrWerivTRMy3u3d5pkx4OC-5QPWIpl6yNhOW8EXTxB5_VafOlsBdD-JUzqbRzZzi58Hzfjig4Sp5pdBCehQdWwMduL7KFV6fmo34yhnmOscOvnVtbvwOSAzVGkAs44UhagPGjXD-ar2GG6YZklT-8tv7A52xJt5WPt8wvOGKUfKVnc6MzmbNuiMUBKOySKz538DB3HKmndhBchPlruJYHy1Liofdl4HJbWKhkVWm53EBYKc83s6UvTxXb6yxHFpJx_EJ8N427Y71k7LoR1fBEaXY86Yz5wc2KjBOQJtvRtXY4IZjXOQoXXMU8fHBVs1dwO55tokiIk_E4kOjmvAR8YcO7El6ZMQfHzBM8MogS3wCtmqLbqrQnNUnY0nAkibGilbLIe0tCvhAk');
 // const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjBjNDMyMjFhZmVhZGJkNmY0YWI3MjAwODBhMDAzOTBmOTM3OTkyZTRjMmI5ODk0MTNhZDMzZWMxMmI5Y2IzMDRjOGIzMGU0MDE2MDYzMGUiLCJpYXQiOjE2MTg4NTc5MzMuOTUyODQ4LCJuYmYiOjE2MTg4NTc5MzMuOTUyODUsImV4cCI6NDc3NDUzMTUzMy45MDU5OTcsInN1YiI6IjUwNDcwMzczIiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIl19.iC8T8qf49vY3Qm7q8alzvBiXZUXxPRyMQ_19947qmz0PIOqGzMy5hCY22ZYQN9m5_9_722YvwEQ_tzgz8mkYiMJ7I7X1FQ5iknC0-cjYsXmOUvIytSia3DE9zIcxfvZwj1sIXGukP9rE29BX8-NLPs9Ec228TlPfUMuujs2hGo6zlLlyu0x_H-1o5t7F7m0JGkjHCWK3JuKbauCXn5ElLkJ7ToLg6zznIUbcS0Rz1zuIBKVtTLBpohGxdwfZUoySzdUpIH-oSOo0USWRbxidNuI9JFrNtEVqLcaeBUv_X4WLKLUcRss9tvPM3JesrIfXkU3P_1ZLiCX3qthvM5FMmVXv3YFhEt3v7kCIdtx6e2TlIvJL2luUJAJsXwj_8dmPKAyBw3HvgvgkcdnYZFPFSPXdv4OZwsMrCrl82KaFVgB8aRDaVAQC9fcKdEvNS61DWLjkjrNZ3FRMYhyXNNk6LaALZPxOFPFMDRGe8GPXV5J9hONuqVswhkst5tQ7fl3Y3VK8dSqyQg7l6aLecYZihnAVwP4JFW6qEpMDPmey9sbsoRFiXjQHuZSUsZBeKQVjhjWT_tVgI1wgY2QIjS9Xg00TNkXVcBwE-vV1jssUyPenQYTI1fdSPK9r0szK2ouTkEdtZIaNw3T63g3_VzrcXiJ9Pj_xTvCNB7MjOkZwZsU');
 // const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDY2NGY2OTE1M2ZjMTY2YmZiMzI3YTZiMTc5ZDRhNGE2NjA5MmUwNzEwZTBlNTBkNDBlZmM3ZjVkZTM0Yzg3ZTRhMjE5NDNiM2IxOGZiMjkiLCJpYXQiOjE2MTg0NzY5NTYuNDM3NzM2LCJuYmYiOjE2MTg0NzY5NTYuNDM3NzM5LCJleHAiOjQ3NzQxNTA1NTYuMzk2ODQ4LCJzdWIiOiIzNzg1OTE1MiIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.OTPPnoyXLRg21-dlgBT4HtE27gF3s_08tOjRO2jfk8ITQZrdGDNjOpRwGneJKS4rFZ104-DtYXnNNKJpPdU8FdY4pgLB3Q2KkrsTOedgcMDhFSC3SYiHHjg2b0aFLw61xxHXZ96BBvBlt0LibtMSGt8Vy-VscixG2FbJs6ctK0VahlU3Oq0SValC7owCVdBP76Fi136fIIIfYJ-_zE23FPkbzsh6q-lFhuDrclHs1Coxb4l-rl9vmPoOJku29PfU474HetLEypTY05ljvqqUP7SetzynBKm_lDvrxAVlXIIx4Z6q9q4qSRJ4DlNkghriQINVvE4k9gQ3fO8C5K55uhK0YHXfBiU8pJuSTIpxsa8nTCrvG3Z2s3YUo6bZdRnQpfs--TZsBv9LNcYfVbJA9mU-v2kWy21GCy-ysina5jEvbr__HfnmV2rG-WLHbbvvWtEfxkPAfmXuSMQyBVVOSNUIowAmfputEuMlwXhJs6j4n24l9RTPzhqQXFBRKzllnEmaec58ouWQ1KBHYDacN8q81RHV1knIMliFQuzSyTJy1TYY6EZqrX2EV8bi5nEojURnchEFeIt536jwWw4PmwbVKTywD_N98Xvoeg7jFsWGuZsWC4VfVhKmT458gmyumlH1aDMlP2ZLXIohHNj7ChfBSJ_u8EEygNXOaR30sRk');
 // const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTVjOTZmZDk1YzAwMDUxODJmZWJiMmVkNTA4NTA2ODA1MGMyODYyNmNiMjE2NTdhMTYzNzFmOTBmZDUwMjFlMjFjN2VlZTc0NGMzZWE4MjkiLCJpYXQiOjE2MTk1NDQ4NzUuNzQxODU3LCJuYmYiOjE2MTk1NDQ4NzUuNzQxODU5LCJleHAiOjQ3NzUyMTg0NzUuNzA4MTc4LCJzdWIiOiI1MDY3MTYyNSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsInByZXNldC5yZWFkIiwid2ViaG9vay53cml0ZSIsIndlYmhvb2sucmVhZCIsInByZXNldC53cml0ZSJdfQ.bJ-sJVMnl8ceYCoYd9v2B8vrhSX9igqeHOT9YPYc9SYxcZwDud9HqkETML-9-2ZHRvvz9JY6STiXjBu0jj3R74MmnN_KTE65MDYQQXqnhA67hqANpcxatFOGq63Q5ydhxbJ-2zZZgLBkTc6dNQN7uYjFt-kZfeVscSzHeFDnKXVxV5NWVCZJrwS9XZCDmKR16zgPmSvVKZZ5KElj1VKyhM5cCCoYdkBHi5Lnh7R6Ria6-C-xhdmR6XPEoS-o_E0qlhcln-8fMMWud9G22kikkP_GK1776WBhdTGcUKbx214EYx86qinDKuN5JjoE75Tb12BP7UpYS1tPKQqCIyNXqJeV3F0iMH9w0EzqqXfJNRWtKDyRPC8dB4lzILlHuzGdwd-SIBu0-j11e8pE71zzRpKFHK5rcDiBfVeb4Ny4js0eDtcBxLKqEjRaMIZujNSA46clLhlFwuzbIjnsnfL4xlXpkQKpUSGjH7CUtInvb904tUS8S4sAPCm2rAp-KQIyGrgnakbKdE-9UITF4IPyxfk4HwFR0GpkexWEw24d_BgIh7cKb7AX-FWE2myqqBBx86Vo8QOAlCKKOfm_q5RkQDxidGTBCrFBlQqkqNXyNsou4tzY7C7zKdsJ2iAKklrKsRI5VqqS-NVALUf0l0DfxC5ONHd8LcGl2qLVCrggUMI');
  /*var s3 = new Aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    // endpoint: new Aws.Endpoint("https://s3.pilw.io")
  })
  var params = {
    Key: 'my-file.docx',
    Bucket: 'app.items.uploads'
  }
  s3.getObject(params, function (err, data) {
    if (err) {
      throw err
    }
   // console.log(data)
   // console.log(String.fromCharCode.apply(null, data.Body.data))

   // const buf = Buffer.from('Hello, World', 'utf8');
    res.send(data);
  }); */
  try {
    // @ts-ignore
    let job = await cloudConvert.jobs.create({
      "tasks": {
        "import-1": {
          "operation": "import/s3",
          "bucket": "app.items.uploads",
          "region": "eu-central-1",
          "access_key_id": "AKIATWJPFQWWKSMVMBGX",
          "secret_access_key": "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",
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

    console.log('----------++------');

    await new Promise((resolve, reject) => {
      writeStream.on('finish', () => { resolve(true) });
      writeStream.on('error', reject);
    });

    console.log('----------------');
   /* const http = require('http');
    const file = fs.createWriteStream("my-file.html");
    http.get("http://storage.cloudconvert.com/tasks/cea9a7a6-5cc9-41da-823d-51e32d5d3bd6/my-file.html?AWSAccessKeyId=cloudconvert-production&Expires=1619015842&Signature=%2Fl38%2FYfF%2BK%2B6mmKibpx6F49OnSo%3D&response-content-disposition=inline%3B%20filename%3D%22my-file.html%22&response-content-type=text%2Fhtml", function(response) {
      response.pipe(file);
    }); */
   // console.log(job)
   /* fs.readFile('../my-file.html', function (err, html) {
      if (err) {
        throw err;
      }
      https.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
      }).listen(8000);
    }); */
    const path = require("path");
    const absolutePath = path.resolve('./my-file.html');
    res.status(200).sendFile(absolutePath);
  } catch (e) {
    res.status(400).json({status: 400, message: "Converting docx to html failed! " + e})
  }
});

app.post("/api/html-upload", async (req, res) => {
  const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjEwZGM0NDk5YjI2MDY1YjJkMzI1NWJmZmM1NjFiMDM0MTA0MjBkNDI3NzcwNmFlMzlkMDVlODg5NGM4ODUwNWY0NzM3NjU0MzRmZTk4MDQiLCJpYXQiOjE2MTkzNTkyNDQuMTA1MTA4LCJuYmYiOjE2MTkzNTkyNDQuMTA1MTExLCJleHAiOjQ3NzUwMzI4NDQuMDQ3OTc4LCJzdWIiOiI1MDYxMzg2NSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSJdfQ.R-qesO7R3l_eWddzHDtvq-kaPjAJSL4Xt2tNLfAKUZVyaQPrEoqG-AUaoSjn8yovvUbNC3rdrAr3zYqEIllsPdvxsbde8ZnexYT3IRXb7emHrWfz2nBDqHeDByf3b5sdC-cHFoM5wQ2a0Tps08SX7j5cw4Ud4WAqOgR_R6dtAjF9E8QDz62m-4hsgyACET-3e0x9ocnx_VU85rkjnTvpM6nGUNtOwbxVtMPuf7keK51c5jTBpmtUzn6b3R7fLJ2BnUzFuyEniiwjcOS4k0gNWhMFbqganmZrWerivTRMy3u3d5pkx4OC-5QPWIpl6yNhOW8EXTxB5_VafOlsBdD-JUzqbRzZzi58Hzfjig4Sp5pdBCehQdWwMduL7KFV6fmo34yhnmOscOvnVtbvwOSAzVGkAs44UhagPGjXD-ar2GG6YZklT-8tv7A52xJt5WPt8wvOGKUfKVnc6MzmbNuiMUBKOySKz538DB3HKmndhBchPlruJYHy1Liofdl4HJbWKhkVWm53EBYKc83s6UvTxXb6yxHFpJx_EJ8N427Y71k7LoR1fBEaXY86Yz5wc2KjBOQJtvRtXY4IZjXOQoXXMU8fHBVs1dwO55tokiIk_E4kOjmvAR8YcO7El6ZMQfHzBM8MogS3wCtmqLbqrQnNUnY0nAkibGilbLIe0tCvhAk');
 // const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjBjNDMyMjFhZmVhZGJkNmY0YWI3MjAwODBhMDAzOTBmOTM3OTkyZTRjMmI5ODk0MTNhZDMzZWMxMmI5Y2IzMDRjOGIzMGU0MDE2MDYzMGUiLCJpYXQiOjE2MTg4NTc5MzMuOTUyODQ4LCJuYmYiOjE2MTg4NTc5MzMuOTUyODUsImV4cCI6NDc3NDUzMTUzMy45MDU5OTcsInN1YiI6IjUwNDcwMzczIiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIl19.iC8T8qf49vY3Qm7q8alzvBiXZUXxPRyMQ_19947qmz0PIOqGzMy5hCY22ZYQN9m5_9_722YvwEQ_tzgz8mkYiMJ7I7X1FQ5iknC0-cjYsXmOUvIytSia3DE9zIcxfvZwj1sIXGukP9rE29BX8-NLPs9Ec228TlPfUMuujs2hGo6zlLlyu0x_H-1o5t7F7m0JGkjHCWK3JuKbauCXn5ElLkJ7ToLg6zznIUbcS0Rz1zuIBKVtTLBpohGxdwfZUoySzdUpIH-oSOo0USWRbxidNuI9JFrNtEVqLcaeBUv_X4WLKLUcRss9tvPM3JesrIfXkU3P_1ZLiCX3qthvM5FMmVXv3YFhEt3v7kCIdtx6e2TlIvJL2luUJAJsXwj_8dmPKAyBw3HvgvgkcdnYZFPFSPXdv4OZwsMrCrl82KaFVgB8aRDaVAQC9fcKdEvNS61DWLjkjrNZ3FRMYhyXNNk6LaALZPxOFPFMDRGe8GPXV5J9hONuqVswhkst5tQ7fl3Y3VK8dSqyQg7l6aLecYZihnAVwP4JFW6qEpMDPmey9sbsoRFiXjQHuZSUsZBeKQVjhjWT_tVgI1wgY2QIjS9Xg00TNkXVcBwE-vV1jssUyPenQYTI1fdSPK9r0szK2ouTkEdtZIaNw3T63g3_VzrcXiJ9Pj_xTvCNB7MjOkZwZsU');
 // const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNDY2NGY2OTE1M2ZjMTY2YmZiMzI3YTZiMTc5ZDRhNGE2NjA5MmUwNzEwZTBlNTBkNDBlZmM3ZjVkZTM0Yzg3ZTRhMjE5NDNiM2IxOGZiMjkiLCJpYXQiOjE2MTg0NzY5NTYuNDM3NzM2LCJuYmYiOjE2MTg0NzY5NTYuNDM3NzM5LCJleHAiOjQ3NzQxNTA1NTYuMzk2ODQ4LCJzdWIiOiIzNzg1OTE1MiIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.OTPPnoyXLRg21-dlgBT4HtE27gF3s_08tOjRO2jfk8ITQZrdGDNjOpRwGneJKS4rFZ104-DtYXnNNKJpPdU8FdY4pgLB3Q2KkrsTOedgcMDhFSC3SYiHHjg2b0aFLw61xxHXZ96BBvBlt0LibtMSGt8Vy-VscixG2FbJs6ctK0VahlU3Oq0SValC7owCVdBP76Fi136fIIIfYJ-_zE23FPkbzsh6q-lFhuDrclHs1Coxb4l-rl9vmPoOJku29PfU474HetLEypTY05ljvqqUP7SetzynBKm_lDvrxAVlXIIx4Z6q9q4qSRJ4DlNkghriQINVvE4k9gQ3fO8C5K55uhK0YHXfBiU8pJuSTIpxsa8nTCrvG3Z2s3YUo6bZdRnQpfs--TZsBv9LNcYfVbJA9mU-v2kWy21GCy-ysina5jEvbr__HfnmV2rG-WLHbbvvWtEfxkPAfmXuSMQyBVVOSNUIowAmfputEuMlwXhJs6j4n24l9RTPzhqQXFBRKzllnEmaec58ouWQ1KBHYDacN8q81RHV1knIMliFQuzSyTJy1TYY6EZqrX2EV8bi5nEojURnchEFeIt536jwWw4PmwbVKTywD_N98Xvoeg7jFsWGuZsWC4VfVhKmT458gmyumlH1aDMlP2ZLXIohHNj7ChfBSJ_u8EEygNXOaR30sRk');
 // const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTVjOTZmZDk1YzAwMDUxODJmZWJiMmVkNTA4NTA2ODA1MGMyODYyNmNiMjE2NTdhMTYzNzFmOTBmZDUwMjFlMjFjN2VlZTc0NGMzZWE4MjkiLCJpYXQiOjE2MTk1NDQ4NzUuNzQxODU3LCJuYmYiOjE2MTk1NDQ4NzUuNzQxODU5LCJleHAiOjQ3NzUyMTg0NzUuNzA4MTc4LCJzdWIiOiI1MDY3MTYyNSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsInByZXNldC5yZWFkIiwid2ViaG9vay53cml0ZSIsIndlYmhvb2sucmVhZCIsInByZXNldC53cml0ZSJdfQ.bJ-sJVMnl8ceYCoYd9v2B8vrhSX9igqeHOT9YPYc9SYxcZwDud9HqkETML-9-2ZHRvvz9JY6STiXjBu0jj3R74MmnN_KTE65MDYQQXqnhA67hqANpcxatFOGq63Q5ydhxbJ-2zZZgLBkTc6dNQN7uYjFt-kZfeVscSzHeFDnKXVxV5NWVCZJrwS9XZCDmKR16zgPmSvVKZZ5KElj1VKyhM5cCCoYdkBHi5Lnh7R6Ria6-C-xhdmR6XPEoS-o_E0qlhcln-8fMMWud9G22kikkP_GK1776WBhdTGcUKbx214EYx86qinDKuN5JjoE75Tb12BP7UpYS1tPKQqCIyNXqJeV3F0iMH9w0EzqqXfJNRWtKDyRPC8dB4lzILlHuzGdwd-SIBu0-j11e8pE71zzRpKFHK5rcDiBfVeb4Ny4js0eDtcBxLKqEjRaMIZujNSA46clLhlFwuzbIjnsnfL4xlXpkQKpUSGjH7CUtInvb904tUS8S4sAPCm2rAp-KQIyGrgnakbKdE-9UITF4IPyxfk4HwFR0GpkexWEw24d_BgIh7cKb7AX-FWE2myqqBBx86Vo8QOAlCKKOfm_q5RkQDxidGTBCrFBlQqkqNXyNsou4tzY7C7zKdsJ2iAKklrKsRI5VqqS-NVALUf0l0DfxC5ONHd8LcGl2qLVCrggUMI');
  console.log('-----------------');
  console.log(req.body.file);
  try {
    // @ts-ignore
    let job = await cloudConvert.jobs.create({
      "tasks": {
        "import-1": {
          "operation": "import/base64",
          "file": nodeBase64.encode(req.body.file),
          "filename": "my-file.html"
        },
        "task-1": {
          "operation": "convert",
          "input_format": "html",
          "output_format": "docx",
          "engine": "office",
          "input": [
            "import-1"
          ],
          "embed_images": false,
          "engine_version": "2019"
        },
        "export-1": {
          "operation": "export/s3",
          "input": [
            "task-1"
          ],
          "bucket": "app.items.uploads",
          "region": "eu-central-1",
          "access_key_id": "AKIATWJPFQWWKSMVMBGX",
          "secret_access_key": "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"
        }
      }
    });
    res.status(200).json({status: 200, message: "Converting html to docx succeeded!"})
  } catch (e) {
    res.status(400).json({status: 400, message: "Converting html to docx failed! " + e})
  }
});

app.use((req, res, next) => {
  if (!req.route) return next(new Error("Url was not matched any route"));
  next();
});

app.use((req, res, next) => {
  if (res.locals.answer !== undefined && res.locals.answer !== null) {
    logger.info(`rest call end. (no error)`);
    if (res.locals.answer !== "DOWNLOAD") {
      res.status(201).json(res.locals.answer);
    }
  } else {
    next(new Error("answer was not found in res.locals"));
  }
});
app.use((error: any, req: any, res: any, next: any) => {
  logger.error(`rest call end time: (error) ${new Date()}`);
  logger.error("Unexpected error:");
  logger.error(error);
  res.status(500).json({ message: error.message });
});

export default app;
