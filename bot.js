const Twit = require('twit')
const express = require('express')
const fs = require('fs-extra')
const config = require('./config.js')
const download = require('image-downloader')
const axios = require('axios')
const moment = require('moment')
const app = express()

//@TODO rename images folder, exclude equal images and host them in Cloudinary
//@TODO filter tweet array by word NOT cachorro NOT RT and pt-br language
//@TODO Use moment for search query date (24h range)




const bot = new Twit(config)

let tweetsList = [];

async function getRandomImg() {
    const url = 'https://res.cloudinary.com/dlecaindb/image/upload/v1581037926/dogs/'
    const randomNumber = Math.ceil(Math.random() * (99) + 1);
    return `${url}${randomNumber}.jpg`
}

async function downloadImg() {
    try {
        const options = {
            url: await getRandomImg(),
            dest: './img/'
        }
        const { filename, image } = await download.image(options)
        console.log(filename) // => /path/to/dest/image.jpg
        return filename
    } catch (e) {
        console.error(e)
    }
}

async function answerTweets(tweetsList) {
    try {
        const filteredTweets = tweetsList.filter((tweet) =>)
        await tweetsList.map(async (tweet) => {
            const imagePath = `./${await downloadImg()}`
            const b64content = fs.readFileSync(imagePath, { encoding: 'base64' })
            const { user, id_str } = tweet
            const params = {
                status: `@${user.screen_name} ${getRandomAnswer()}, olha aqui um cachorro fofinho pra te alegrar! \n :)`,
                //media_ids: [mediaIdStr], in_reply_to_status_id: '' + id_str
            }
            console.log(params)

            // bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
            //     const mediaIdStr = data.media_id_string
            //     const altText = "A random dog picture"
            //     const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
            //     bot.post('media/metadata/create', meta_params, function (err, data, response) {
            //         if (!err) {
            //             const params = { status: `@${user.screen_name} ${getRandomAnswer()}, olha aqui um cachorro fofinho pra te alegrar! \n :)`, media_ids: [mediaIdStr], in_reply_to_status_id: '' + id_str }

            //             bot.post('statuses/update', params, function (err, data, response) {
            //             })
            //         }
            //     })
            // })

        })
        fs.emptyDirSync('./img/')
    } catch (e) {
        console.error(e)
    }
    console.log('answering tweets...')
}


function getRandomQuote() {
    const sadQuotes = [
        'to na bad',
        'to triste',
        'estou triste',
        'eu to muito triste',
        'eu tô na bad'
    ]

    return sadQuotes[Math.floor(Math.random() * sadQuotes.length)]
}

function getRandomAnswer() {
    const happyAnswers = [
        'não fica triste!',
        'não fique assim!',
        'vai dar tudo certo!',
    ]
    return happyAnswers[Math.floor(Math.random() * happyAnswers.length)]
}

async function searchTweet() {
    try {
        //const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
        const today = moment().format('YYYY-MM-DD')
        const result = await bot.get('search/tweets', { q: `${getRandomQuote()}  since:${today}`, count: 10, locale: 'pt-br' })
        const { data } = result
        const tweetsData = data.statuses
        tweetsList = tweetsData
    } catch (e) {
        console.error(e)
    }
    console.log('searching tweets...')
}


async function runBot() {
    try {
        await getRandomImg()
        await downloadImg()
        await searchTweet()
        await answerTweets(tweetsList)
    } catch (e) {
        console.error(e)
    }
}

runBot()
app.get('/tweets', (req, res) => {
    return res.json(tweetsList)
})



app.listen(3333);







