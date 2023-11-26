const fs = require("fs");

const saveFile = (req, res) => {
    fs.writeFile("data.json", JSON.stringify(req.body), err => {
        if (err)
            res.send(err);
        else {
            res.send("File written successfully");
        }
    });
};

const readFile = (req, res) => {
    fs.readFile("data.json", (err, data) => {
        if (err)
            res.send(err);
        else {
            const parsedData = JSON.parse(data);
            res.send(parsedData);
        }
    });
};

module.exports = {
    saveFile,
    readFile
};