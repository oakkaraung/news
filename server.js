const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", (req, res) => {
    axios.get("https://www.vox.com/").then((response) => {
        const $ = cheerio.load(response.data);
        $(".c-entry-box--compact__body").each(function (i, element) {
            const result = {};
            result.title = $(this).children("h2").children("a").text();
            result.summary = $(this).children("p").text();
            result.link = $(this).children("h2").children("a").attr("href");
            db.Article.create(result)
                .then((dbArticle) => {
                    console.log(dbArticle);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({})
        .then(dbArticle => {
            res.json(dbArticle)
        }).catch((err) => {
            console.log(err);
        });
});

app.get("/articles/:id", (req, res) => {
    db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {saved: true}})
        .then(dbArticle => {
            res.json(dbArticle)
        }).catch((err) => {
            console.log(err);
        });
})

app.get("/clear", (req, res) => {
    db.Article.remove({}).then(dropped => {
        res.send("Cleared")
    }).catch(err => {
        res.json(err);
    })
})

app.get("/saved", (req, res) => {
    db.Article.find({saved: true}).then(dbArticle => {
        res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    })
})

app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});
