import * as TwitBot from '../src/bots/twitBot'
import express from 'express'
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

runMainBot()

const app = express()
app.get('/status', (req, res) => {
  return res.json({ message: 'Running' })
})

app.listen(process.env.PORT || 3333)
