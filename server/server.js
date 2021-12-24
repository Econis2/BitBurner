const express = require('express')
const app = express()
const port = 9000

app.use(express.static("scripts"))

// app.get("/hosts", (req, res) => {
//     // req.query
// })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})