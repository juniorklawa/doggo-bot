const mongoose = require('mongoose')

const TweetSchema = new mongoose.Schema({
  tweetId: String,
})

module.exports = mongoose.model('Tweet', TweetSchema)
