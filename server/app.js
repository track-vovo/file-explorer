const express = require('express')
const server = express()
const fs = require('fs')
const path = require('path')

const STATIC_URL = '/file-static'
const FILE_URL = path.join(__dirname, STATIC_URL)

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { moduleType, contentType } = req.body
    let dest = FILE_URL
    if (moduleType) {
      dest += `/${moduleType}`
      if (contentType) {
        dest += `/${contentType}`
      }
    }
    cb()
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

server.use('/file-static', express.static(FILE_URL))

let fileArr = []
const fileDisplay = filePath => {
  try {
    fs.accessSync(filePath, fs.constants.R_OK)
    const fileList = fs.readdirSync(filePath)
    fileList.forEach(fileName => {
      const fileDir = path.join(filePath, fileName)
      const fileStat = fs.statSync(fileDir)
      if (fileStat.isFile()) {
        let fileObj = {
          id: fileStat.ino,
          name: fileName,
          url: STATIC_URL + filePath.split(FILE_URL)[1] + '/' + fileName,
          isImg: false,
          preview: null
        }
        if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          fileObj.isImg = true
          fileObj.preview = STATIC_URL + filePath.split(FILE_URL)[1] + '/' + fileName
        }
        fileArr.push(fileObj)
      }
    })
  } catch (err) {
    console.log('fileDisplay', err)
  }
}