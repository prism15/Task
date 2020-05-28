const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
//const app = require('./app');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();

const router =express.Router();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended : true}));

let gfs;

const conn = mongoose.createConnection("mongodb://localhost:27017/multerdb" ,{useNewUrlParser:true,useUnifiedTopology:true});

conn.once("open", function(){
   gfs = Grid(conn.db , mongoose.mongo);
   gfs.collection('uploads');
});


var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/multerdb",
  file : function(req,file){
    return new Promise(function(resolve,reject){
      crypto.randomBytes(16,function(err,buf){
        if(err){
          return reject(err);
        }
        const filename = buf.toString('hex')+path.extname(file.originalname);
        const fileinfo = {
          filename : filename,
          bucketName : 'uploads'
        };
        resolve(fileinfo);
      });
    });
  }
});
const upload = multer({storage});

router.get("./upload", function(req,res){
  gfs.files.find().toArray(function(err,files){
    if(!files || files.length===0){
      res.render("index",{files:false});
    }else{
      files.map(function(file){
        if(file.contentType === 'video/mp4'){
          file.isVideo = true;
        }else{
          file.isVideo= false;
        }
      });
      res.render("index",{files:files});
    }
  });
});
router.post("/upload",upload.single('videoFile'),function(req,res){
  res.json({videoFile : req.file});
});
router.get("/files",function(req,res){
  gfs.files.find().toArray(function(err,files){
    if(!files || files.length===0){
      return res.status(404).json({err:"No files exist"});
    }
  });
});
router.get("/files/:filename",function(req,res){
  gfs.files.findOne({filename: req.params.filename},function(err,file){
    if(!file || file.length===0){
      return res.status(404).json({err:"No file exists"});
    }else{
      return res.json(file);
    }
  });
});

//Route to access individual video file
router.get("/video/:filename",function(req,res){
  gfs.files.findOne({filename: req.params.filename},function(err,file){
    if(!file || file.length===0){
      return res.status(404).json({err:"No file exists"});
    }
    //check if image
    if(file.contentType==='video/mp4'){
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }else{
      res.status(404).json({
        err:"Not a video"
      })
    }
  });
});

module.exports = router;
