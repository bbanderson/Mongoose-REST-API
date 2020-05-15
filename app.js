const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true, useUnifiedTopology:true})

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = new mongoose.model('Article', articleSchema)

app.route('/articles')
  .get(function (req, res) {
    Article.find(function (err, result) {
      if (!err) {
        res.send(result);
        
      }
    })
  })
  .post(function (req, res) {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })

    article.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.")
      } else {
        res.send(err)
      }
    })
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) res.send("Successfully deleted all articles.")
      else res.send(err)
    })
  });

app.route('/articles/:articleTitle')
  .get(function (req, res) {
    Article.findOne({title: req.params.articleTitle}, function (err, result) {
      if (!err) {
        res.send(result)
      } else {
        res.send(err)
      }
    })
  })
  .put(function (req, res) {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function (err) {
        if (!err) {
          res.send("The article has been updated.")
        }
      }
    )
  })

  .patch(function (req, res) {
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function (err) {
        if (!err) {
          res.send("The article has been updated.")
        }
      }
    )
  })

  .delete(function (req,res) {
    Article.deleteOne(
      {title: req.params.articleTitle},
      function (err) {
        if (!err) {
          res.send("The article has been deleted.")
        }
      })
  });

app.listen(process.env.PORT || 3000, () => console.log("Server is connected on port 3000."))