import * as TwitBot from '../src/bots/twitBot'

const express = require('express')
const app = express()
const fs = require('fs-extra')

async function runBot() {
  try {
    fs.emptyDirSync('./img/')
    await TwitBot.searchTweet()
    //await answerTweets(tweetsList)
  } catch (e) {
    console.error(e)
  }
}

runBot()

// app.get('/tweets', (req, res) => {
//   return res.json(jsonReturn)
// })

app.listen(process.env.PORT || 3333)
