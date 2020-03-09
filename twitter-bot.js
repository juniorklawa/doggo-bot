const Twit = require('twit')
const config = require('./credentials/config.js')
const bot = new Twit(config)
const moment = require('moment')
let tweetsList = []

export async function searchTweet() {
  try {
    //const now = moment().format("YYYY-MM-DD");
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
    const randomQuote = getRandomSnippet()
    //const today = moment().format("YYYY-MM-DD");
    const result = await bot.get('search/tweets', {
      q: `${randomQuote}  since:${yesterday}`,
      count: 10,
    })
    const { data } = result
    const tweetsData = data.statuses
    tweetsList = tweetsData
    jsonReturn = tweetsList
  } catch (e) {
    console.error(e)
  }
  console.log('searching tweets...')
}
