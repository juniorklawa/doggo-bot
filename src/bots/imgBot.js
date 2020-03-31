import 'dotenv/config'

const download = require('image-downloader')

async function getRandomImgURL() {
  const randomNumber = Math.ceil(Math.random() * process.env.MAX + 1)

  return `${process.env.CLOUDINARY_URL}${randomNumber}.jpg`
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
