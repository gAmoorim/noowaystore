const path = require('path')
const fs = require('fs')
const multer = require('multer')

const uploadDir = path.resolve(__dirname, '..', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const nomeUnico = Date.now() + '-' + file.originalname
        cb(null, nomeUnico)
    }
})

const upload = multer({ storage })

module.exports = upload
