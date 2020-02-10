const Twit = require("twit");
const fs = require("fs-extra");
const config = require("./config.js");
const moment = require("moment");
const bot = new Twit(config);

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
