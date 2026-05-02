const path = require('path')
const fs = require('fs')
const multer = require('multer')

const isVercel = process.env.VERCEL === '1'

let upload

if (isVercel) {
  upload = multer({ storage: multer.memoryStorage() })
} else {
  const uploadDir = path.resolve(__dirname, '..', 'uploads')
  fs.mkdirSync(uploadDir, { recursive: true })

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  })

  upload = multer({ storage })
}

module.exports = upload