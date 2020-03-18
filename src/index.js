import * as TwitBot from '../src/bots/twitBot'

// const express = require('express')
// const app = express()
const fs = require('fs-extra')

async function runBot() {
  try {
    fs.emptyDirSync('./img/')
    const tweetsList = await TwitBot.searchTweet()
    await TwitBot.answerTweets(tweetsList)
  } catch (e) {
    console.error(e)
  }
}

runBot()
//TODO DASHBOARD
// app.get('/tweets', (req, res) => {
//   return res.json(jsonReturn)
// })

// app.listen(process.env.PORT || 3333)
