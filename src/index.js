import * as TwitBot from '../src/bots/twitBot'
import express from 'express'
const app = express()
const fs = require('fs-extra')

async function runMainBot() {
  try {
    fs.emptyDirSync('./img/')
    const tweetsList = await TwitBot.searchTweet()
    await TwitBot.answerTweets(tweetsList)
  } catch (e) {
    console.error(e)
  }
}

//@TODO FIX THIS
runMainBot()
app.get('/tweets', (req, res) => {
  return res.json({ status: 'Running!' })
})

app.listen(process.env.PORT || 3333)
