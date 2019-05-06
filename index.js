const express = require("express");
const app = express();

const NeDB = require("nedb");
const db = {
    tasks: new NeDB({
        filename: "data/tasks",
        autoload: true
    })
};

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.route("/tasks").get((req, res) => {
    db.tasks.find({}, (err, docs) => {
        res.send(docs);
    });
});

app.post("/tasks", (req, res) => {
    db.tasks.insert({ name: req.params.name }, (err, newDoc) => {
        res.send(newDoc);
    });
});

app.put("/tasks/:id", (req, res) => {
    db.tasks.update(
        { _id: req.params.id },
        { $set: { name: req.body.name } },
        { upsert: false, returnUpdatedDocs: true },
        (err, numOfDocs, updatedDocs) => {
            res.send(updatedDocs);
        }
    );
});

app.delete("/tasks/:id", (req, res) => {
    db.tasks.remove({ _id: req.params.id }, {}, (err, numOfDocs) => {
        res.send();
    });
});

app.listen(3000, () => console.log("listening at port 3000"));
