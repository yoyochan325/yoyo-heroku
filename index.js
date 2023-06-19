const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3030;

app.use(cookieParser());

app.use(function (req, res, next) {

    let session = req.cookies["session"];

    console.log(req.cookies);

    if (typeof session == "undefined") {

        session = Math.random().toString();

        res.cookie('session', session);
    }

    next();
});

app.use(express.static("./public"));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// app.get('/products/:productId', async function (req, res) {

//     try {
//         const resource = await fs.readFile(
//             path.join(__dirname, "products", req.params.productId)
//         );

//         res.json(resource.toString());
//     }
//     catch (e) {
//         console.error(e);
//         res.status(500).end();
//     }
// });


const messageBuffer = {};

app.post('/api/submit', async function (req, res) {

    let session = req.cookies["session"];

    try {
        if (!messageBuffer.hasOwnProperty(session)) {

            messageBuffer[session] = [];
        }

        for (let key of Object.keys(messageBuffer)) {
            messageBuffer[key].push(req.body.data);
        }

        res.status(200).end();
    }
    catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.post('/api/poll', async function (req, res) {

    try {

        let session = req.cookies["session"];

        res.status(200).end(JSON.stringify(messageBuffer[session]), function () {
            messageBuffer[session] = [];
        });

    }
    catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));