const cloudinaryConfig = require("./credentials/cloudinary.js");
const download = require("image-downloader");

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
