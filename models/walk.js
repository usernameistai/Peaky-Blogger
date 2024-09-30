const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_300')
});

const opts  = { toJSON: { virtuals: true }};

const WalkSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: [ 'Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  journey: String,
  foodplace: String,
  opinion: String,
  url: String,
  file: String,
  name: String,
  email: String,
  phone: String,
  message: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
}, opts);

WalkSchema.virtual('properties.popUpMarkup').get(function(){
  return `<strong><a href="/walks/${this._id}" style="text-decoration: none;">
  ${this.title}</a></strong>
  <p><i>${this.description.substring(0, 20)}...</i></p>
  <p>${this.location}</p>`
});

WalkSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const walk = mongoose.model('Walk', WalkSchema);
module.exports = walk;