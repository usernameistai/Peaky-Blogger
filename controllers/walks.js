const Walk = require('../models/walk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
  const walks = await Walk.find({});
  res.render('walks/index', {walks});
};

module.exports.renderNewForm = (req, res) => {
  res.render('walks/new');
};

module.exports.createWalk = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.walk.location,
    limit: 1
  }).send()
  const walk = new Walk(req.body.walk);
  walk.geometry = geoData.body.features[0].geometry;
  walk.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  walk.author = req.user._id;
  await walk.save();
  // console.log(walk);
  req.flash('success', 'Successfully posted a new Walk');
  res.redirect(`/walks/${walk._id}`);
};

module.exports.showWalk = async (req, res) => {
  const { id } = req.params;
  const walk = await Walk.findById(id)
    .populate({path: 'reviews', populate: { path: 'author' }})
    .populate('author');
  if(!walk) {
    req.flash('error', 'Cannot find that walk');
    return res.redirect('/walks');
  }
  res.render('walks/show', {walk: walk});
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const walk = await Walk.findById(id);
  if(!walk) {
    req.flash('error', 'Cannot find that walk');
    return res.redirect('/walks');
  }
  res.render('walks/edit', {walk: walk});
};

module.exports.updateWalk = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const walk = await Walk.findByIdAndUpdate(id, {...req.body.walk});
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
  walk.images.push(...imgs); // takes data from array as opposed to pushing in array
  await walk.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await walk.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}}); // PULL OUT OF IMAGES ARRAY WHERE FILENAME IS IN REQ.BODY.DELETEIMAGES
    req.flash('success', 'Deleted image from db');
    // console.log(walk);
  }
  
  req.flash('success', ' Successfully updated Walk');
  res.redirect(`/walks/${walk._id}`);
};

module.exports.deleteWalk = async (req, res) => {
  const { id } = req.params;
  const walk = await Walk.findByIdAndDelete(id);
  req.flash('success', 'Deleted your walk');
  res.redirect('/walks');
};