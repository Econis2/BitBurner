"use strict";
const express = require('express');
const path = require('path');
const app = express();
const port = 9000;
let distDir = path.dirname(__dirname);
app.use(express.static(path.join(distDir, "dist")));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
