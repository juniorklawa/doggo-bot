import * as TwitBot from '../src/bots/twitBot'
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
