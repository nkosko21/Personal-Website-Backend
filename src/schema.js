import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model('Image', ImageSchema);
export default Image;
