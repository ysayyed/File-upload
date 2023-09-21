const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      return cb(null, `${file.originalname}`)
    }
  })
  
const upload = multer({ storage })

app.get('/', (req,res)=>{
    res.set('Content-Type', 'text/html')
    res.status(200)
    res.render('index')
    res.end()
})

app.get('/uploadPage', (req,res)=>{
    res.status(200)
    res.render("uploadPage")
    res.end()
})

app.post('/uploadPage', upload.single("someFile"), (req, res)=>{
    res.redirect("imagePage")
    res.end()
})

app.get('/imagePage', (req, res)=>{
    fs.readdir('./uploads', (err, files) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('imagePage', { images: files });
        }
      });
})

app.listen(3000, ()=>{
    console.log("Server running at 3000")
})