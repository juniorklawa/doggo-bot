const cloudinaryConfig = require("../credentials/cloudinary");
const download = require("image-downloader");

class robot {
  robot() {
    this.getDogImage = await downloadImg();
    this.getRandomImage = await getRandomImg();
  }

  async getRandomImg() {
    const url = 'https://res.cloudinary.com/dlecaindb/image/upload/v1581037926/dogs/'
    const max = 404;
    const randomNumber = Math.ceil(Math.random() * max + 1);
    return `${url}${randomNumber}.jpg`;
  }
  async downloadImg() {
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
}



module.exports = robot;
