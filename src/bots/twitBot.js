import 'dotenv/config'
import moment from 'moment'
import * as TextBot from '../bots/textBot'
import * as FilterBot from '../bots/filterBot'
import * as ImageBot from '../bots/imgBot'
const Tweet = require('../models/Tweet')
const mongoose = require('mongoose')
const Twit = require('twit')
const fs = require('fs-extra')
const config = require('../../credentials/config')

const bot = new Twit(config)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
export async function searchTweet() {
  console.log('searching tweets...')
  try {
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
    const randomQuote = TextBot.getRandomSnippet()
    const result = await bot.get('search/tweets', {
      q: `${randomQuote}  since:${yesterday}`,
      count: 10,
    })
    const { data } = result
    const tweetsData = data.statuses
    return tweetsData
  } catch (e) {
    console.error(e)
  }
}

export async function answerTweets(tweetsList) {
  try {
    const filteredTweets = await FilterBot.tweetFilterBot(tweetsList)

    await filteredTweets.map(async tweet => {
      const imagePath = `./${await ImageBot.downloadImg()}`
      const b64content = fs.readFileSync(imagePath, { encoding: 'base64' })
      console.log(b64content)
      const { user, id_str } = tweet

      const isTweetAlreadyAnswered = await Tweet.findOne({
        tweetId: id_str,
      })

      if (!isTweetAlreadyAnswered) {
        bot.post('media/upload', { media_data: b64content }, function(
          err,
          data
        ) {
          const mediaIdStr = data.media_id_string
          const altText = 'A random cute puppy picture'
          const meta_params = {
            media_id: mediaIdStr,
            alt_text: { text: altText },
          }

          console.log(data)

          bot.post('media/metadata/create', meta_params, async function(err) {
            if (!err) {
              const params = {
                status: `@${
                  user.screen_name
                } ${TextBot.getRandomAnswer()} olha aqui um cachorro fofinho pra te alegrar! \n :)`,
                media_ids: [mediaIdStr],
                in_reply_to_status_id: '' + id_str,
              }

              bot.post('statuses/update', params, function() {})
              console.log(`answering tweet with id: ${id_str}`)

              await Tweet.create({
                tweetId: id_str,
              })
            }
          })
        })
      }
    })
  } catch (e) {
    console.error(e)
  }
}
