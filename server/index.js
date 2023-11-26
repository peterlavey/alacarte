const express = require('express');
const {saveFile, readFile} = require("./api/fileSystem");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

app.get('/', readFile);
app.post('/', saveFile)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});