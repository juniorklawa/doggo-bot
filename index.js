

const app = express();

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
