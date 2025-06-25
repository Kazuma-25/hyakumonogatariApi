//ライブラリ読み込み
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//.env
const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

//mongoDB接続
mongoose.connect(mongoURI).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

//mongooseのスキーマを作成
  const itemSchema = new mongoose.Schema({
  postedBy:String, //型を指定
  postedAt:Date,
  title: String,
  thumbnail:String,
  mainSentence:String,
  flags:[]
}, { versionKey:false });

//コレクション指定
const ItemStd = mongoose.model('Item', itemSchema, 'standard_story');
const ItemExt = mongoose.model('Item', itemSchema, 'extended_story');

//GETリクエスト
  //std_get
  app.get('/items/std', async (req, res) => {
    try{
      const resItemsStd = await ItemStd.find();
      res.json(resItemsStd);
    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'stdデータ取得に失敗しました' });
    }
  });
  //ext_get
  app.get('/items/ext', async (req, res) => {
    try{
      const resItemsExt = await ItemExt.find();
      res.json(resItemsExt);
    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'extデータ取得に失敗しました' });
    }
  });

//POSTリクエスト
  //std_post
  app.post('/postStory/std',async(req,res) => {
    try{
      const newStoryStd = new ItemStd(req.body);
      const savedStoryStd = await newStoryStd.save();
      res.json(savedStoryStd)
      console.log(new Date() + 'saved_std')
    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'stdデータ保存に失敗しました' });
    }
  });
  //ext_post
  app.post('/postStory/ext',async(req,res) => {
    try{
      const newStoryExt = new ItemExt(req.body);
      const savedStoryExt = await newStoryExt.save();
      res.json(savedStoryExt)
      console.log(new Date() + 'saved_ext')
    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'extデータ保存に失敗しました' });
    }
  });
//serverUp
app.listen(port, () => console.log(`Server running on port ${port}`));