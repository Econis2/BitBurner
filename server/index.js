"use strict";
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 9000;
let distDir = path.dirname(__dirname);
const corsOpts = {
    origin: "*"
};
app.use(cors(corsOpts));
app.use(express.static(path.join(distDir, "dist")));
// app.get("/hosts", (req, res) => {
//     // req.query
// })
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
