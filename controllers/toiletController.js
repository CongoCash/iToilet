const db = require('../models');

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyDtDkrXzXkujBCx8mAFT393o2A5L3Fg6qY', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

let limit = 5;


function count (req, res) {
  db.Toilet.find({}, function (err, allToilets) {
    if (err) {
      console.log('ERROR at count controller ', err);
    }
    let lengthOfToilets = allToilets.length;
    console.log('length of toilets', lengthOfToilets);
    res.json(lengthOfToilets);
  })
}



function index(req, res) {
  db.Toilet.find({rating: { $gte: parseInt(req.params.ratingLimit) }}, function(err, allToilets) {
    if (err) {
      console.log('ERROR at index controller ', err);
    }
    res.json(allToilets)
  }).limit(limit).skip(parseInt(req.params.skip));
}

function create(req, res) {

    geocoder.geocode(req.body.address, function(err, response) {
        db.Toilet.create({
            name: req.body.name,
            lat: response[0].latitude,
            long: response[0].longitude,
            address: response[0].formattedAddress,
            price: req.body.price,
            rating: req.body.rating,
            public: req.body.public,
            availability: req.body.availability,
            amount: req.body.amount,
            pictures: req.body.pictures,
        }, function(err, createdToilet) {
            res.send(createdToilet);
        });
    })


}

function update(req,res) {
  db.Toilet.findByIdAndUpdate(req.body.id, {new:true}, (err, toilet) => {
    console.log(req.body);
    toilet.name = req.body.name;
    toilet.address = req.body.address;
    toilet.price = req.body.price;
    toilet.public = req.body.public;
        // toilet.rating = req.body.rating,
    toilet.amount = req.body.amount;
    toilet.save();
    res.sendStatus(200);

  })
}

function destroy(req,res) {
  db.Toilet.findByIdAndRemove({_id: req.params.id}, function(err, deletedToilet) {
    res.sendStatus(200);
  });
}




module.exports = {
  count: count,
  index: index,
  create: create,
  update: update,
  destroy: destroy,

}
