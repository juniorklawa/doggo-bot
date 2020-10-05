import 'dotenv/config';
const download = require('image-downloader');

export async function downloadImageService(pathUrl) {
  try {
    const options = {
      url: pathUrl,
      dest: './img/',
    };
    const { filename } = await download.image(options);
    return filename;
  } catch (e) {
    console.error(e);
  }
}
