const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Walk = require("../models/walk");

mongoose
  .connect("mongodb://localhost:27017/peakyblogger")
  .then(() => console.log("Mongo Connection Open"))
  .catch((err) => {
    console.log("Oh no Mongo Connection Error");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Walk.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 25) + 10;
    const walk = new Walk({
      author: '66e989853583aa3aa0b37035',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: `https://picsum.photos/400?random=${Math.random()}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta inventore quis sapiente. In magni impedit voluptates commodi labore veniam, earum repellendus accusamus placeat, vel consequatur ut, eaque quasi. Soluta, aliquid?",
      price: price,
      geometry: { // ADDED FROM STACK OVERFLOW
        type: 'Point',
        coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/future-source/image/upload/v1726741084/PeakyBlogger/wvorheq2smrbrmbe7jf8.jpg',
          filename: 'PeakyBlogger/wvorheq2smrbrmbe7jf8'
        },
        {
          url: 'https://res.cloudinary.com/future-source/image/upload/v1726741084/PeakyBlogger/wwoowachrt3hc0eutz99.jpg',
          filename: 'PeakyBlogger/wwoowachrt3hc0eutz99'
        }
      ]
    });
    await walk.save();
  }
};

seedDB().then(() => {
  db.close();
  console.log("Mongo connection closed");
});
