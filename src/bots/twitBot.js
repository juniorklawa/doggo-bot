import moment from 'moment'
import * as TextBot from '../bots/textBot'
const Twit = require('twit')
const config = require('../../credentials/config')

const bot = new Twit(config)
export async function searchTweet() {
  console.log('searching tweets...')
  try {
    //const now = moment().format("YYYY-MM-DD");
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
    const randomQuote = TextBot.getRandomSnippet()
    //const today = moment().format("YYYY-MM-DD");
    const result = await bot.get('search/tweets', {
      q: `${randomQuote}  since:${yesterday}`,
      count: 10,
    })
    const { data } = result
    const tweetsData = data.statuses
    console.log(tweetsData)
    return tweetsData
  } catch (e) {
    console.error(e)
  }
}
