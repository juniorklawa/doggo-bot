const download = require('image-downloader')
const cloudinaryConfig = require('../../credentials/cloudinary.json')

async function getRandomImgURL() {
  const url = cloudinaryConfig.url
  const max = cloudinaryConfig.max_size
  const randomNumber = Math.ceil(Math.random() * max + 1)

  return `${url}${randomNumber}.jpg`
}

export async function downloadImg() {
  try {
    const options = {
      url: await getRandomImgURL(),
      dest: './img/',
    }
    const { filename } = await download.image(options)
    return filename
  } catch (e) {
    console.error(e)
  }
}
