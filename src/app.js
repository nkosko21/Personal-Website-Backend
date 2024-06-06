import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import Image from './schema.js';

dotenv.config();
const MONGODB_URI = 'mongodb+srv://nickoy7:uVQ5JOFTJUrMHFvw@cluster0.jbw6vdb.mongodb.net/';

const app = express();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const newImage = new Image({
    month: req.body.month,
    year: req.body.year,
    img: {
      data: req.file?.buffer,
      contentType: req.file?.mimetype,
    },
  });

  newImage.save()
    .then(() => res.json('Image uploaded successfully'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

app.get('/images', async (req, res) => {
  const { month, year } = req.query;

  try {
    const images = await Image.find({ month, year });
    var newImages = [];
    images.forEach(image => {
      const base64Image = Buffer.from(image.img.data).toString('base64');
      const imageUrl = `data:${image.img.contentType};base64,${base64Image}`;
      newImages.push(imageUrl);
    })
    res.json(newImages);
  } catch (error) {
    res.status(400).json(`Error: ${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
