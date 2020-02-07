const Twit = require('twit')
const express = require('express')
const fs = require('fs-extra')
const config = require('./config.js')
const download = require('image-downloader')
const axios = require('axios')
const moment = require('moment')
const app = express()

//@TODO filter tweet array by word cachorro and pt-br language
//@TODO Use moment for search query date
//@TODO Train model to indentify puppies teachable machine with google


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
        const imagePath = `./${await downloadImg()}`
        const b64content = fs.readFileSync(imagePath, { encoding: 'base64' })
        await tweetsList.map((tweet) => {
            const { user, id_str } = tweet
            bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
                const mediaIdStr = data.media_id_string
                const altText = "A random dog picture"
                const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
                bot.post('media/metadata/create', meta_params, function (err, data, response) {
                    if (!err) {
                        var params = { status: 'Não fique triste, Olha aqui uma foto de um cachorro pra te alegrar! @' + user.screen_name, media_ids: [mediaIdStr], in_reply_to_status_id: '' + id_str }

                        bot.post('statuses/update', params, function (err, data, response) {
                        })
                    }
                })
            })
        })

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
        'Não fica triste!',
        'Não fique assim assim!',
        'Vai dar tudo certo!',
    ]
    return happyAnswers[Math.floor(Math.random() * happyAnswers.length)]
}

async function searchTweet() {

    try {
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
        const today = moment().format('YYYY-MM-DD')
        const result = await bot.get('search/tweets', { q: `${'quase chorei mt bom parabéns'}  since:${yesterday}`, count: 1, locale: 'pt-br' })
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
        //await searchTweet()
        //await answerTweets(tweetsList)
        //fs.emptyDirSync('./img/')
    } catch (e) {
        console.error(e)
    }
}

runBot()
app.get('/tweets', (req, res) => {
    return res.json(tweetsList)
})



app.listen(3333);







