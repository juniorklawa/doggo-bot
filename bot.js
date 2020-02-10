const Twit = require("twit");
const express = require("express");
const fs = require("fs-extra");
const config = require("./config.js");
const cloudinaryConfig = require("./credentials/cloudinary.js");
const download = require("image-downloader");
const moment = require("moment");
const app = express();

//@TODO double tweet bug
//@TODO decent structure
//@TODO IBM Watson
//@TODO add node schedule
//@TODO add tests

const bot = new Twit(config);
let jsonReturn = null;
let tweetsList = [];

async function getRandomImg() {
  const url = cloudinaryConfig.url;
  const max = cloudinaryConfig.max_size;
  const randomNumber = Math.ceil(Math.random() * max + 1);
  return `${url}${randomNumber}.jpg`;
}

async function downloadImg() {
  try {
    const options = {
      url: await getRandomImg(),
      dest: "./img/"
    };
    const { filename, image } = await download.image(options);
    return filename;
  } catch (e) {
    console.error(e);
  }
}

async function answerTweets(tweetsList) {
  try {
    const filteredTweets = tweetsList.filter(tweet => {
      const { text, metadata } = tweet;
      return (
        metadata.iso_language_code === "pt" &&
        !text.includes("RT") &&
          !text.includes("cachorro") &&
          !text.includes("Cachorro")
      );
    });

    jsonReturn = filteredTweets;
    await filteredTweets.map(async tweet => {
      const imagePath = `./${await downloadImg()}`;
      const b64content = fs.readFileSync(imagePath, { encoding: "base64" });
      const { user, id_str } = tweet;
      bot.post("media/upload", { media_data: b64content }, function(
        err,
        data,
        response
      ) {
        const mediaIdStr = data.media_id_string;
        const altText = "A random puppy picture";
        const meta_params = {
          media_id: mediaIdStr,
          alt_text: { text: altText }
        };
        bot.post("media/metadata/create", meta_params, function(
          err,
          data,
          response
        ) {
          if (!err) {
            const params = {
              status: `@${
                user.screen_name
              } ${getRandomAnswer()}, olha aqui um cachorro fofinho pra te alegrar! \n :)`,
              media_ids: [mediaIdStr],
              in_reply_to_status_id: "" + id_str
            };

            bot.post("statuses/update", params, function(
              err,
              data,
              response
            ) {});
            console.log(`answering tweet with id: ${id_str}`);
          }
        });
      });
    });
  } catch (e) {
    console.error(e);
  }
}

function getRandomQuote() {
  const sadQuotes = [
    "to na bad",
    "to triste",
    "estou triste",
    "eu to muito triste",
    "eu tô na bad"
  ];

  return sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
}

function getRandomAnswer() {
  const happyAnswers = [
    "não fica triste!",
    "não fique assim!",
    "vai dar tudo certo!"
  ];
  return happyAnswers[Math.floor(Math.random() * happyAnswers.length)];
}

async function searchTweet() {
  try {
    const now = moment().format("YYYY-MM-DD");
    //const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const randomQuote = getRandomQuote();
    const today = moment().format("YYYY-MM-DD");
    const result = await bot.get("search/tweets", {
      q: `${randomQuote}  since:${today}`,
      count: 1
    });
    const { data } = result;
    const tweetsData = data.statuses;
    console.log(data);
    tweetsList = tweetsData;
    jsonReturn = tweetsList;
  } catch (e) {
    console.error(e);
  }
  console.log("searching tweets...");
}

async function runBot() {
  try {
    await getRandomImg();
    await downloadImg();
    await searchTweet();
    await answerTweets(tweetsList);
    fs.emptyDirSync("./img/");
  } catch (e) {
    console.error(e);
  }
}

runBot();
app.get("/tweets", (req, res) => {
  return res.json(jsonReturn);
});

app.listen(3333);
