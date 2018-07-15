var express = require("express");
var path = require("path");
var url = require("url");
var mongodb = require('mongodb');
var Base62 = require('base62');

var app = express();

var MongoClient = mongodb.MongoClient;

var url = process.env.MONGOLAB_URI;
var root_url = "https://sho.herokuapp.com/";

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(request, response, next) {
    console.log("In comes a " + request.method + " to " + request.url);
    next();
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get('/*', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);

           // var str = req.params[0];
              var str = req.originalUrl.slice(1, req.originalUrl.length);
            if (/^https?:\/\//gi.test(str) && /(.+)\.(.+)/gi.test(str)) {

              db.collection('urls').find({'original_url':str},{ original_url: 1, index: 1, _id:0 }).toArray(function(err, search){
                if(search.length>0){
                    res.setHeader('Content-Type', 'application/json');
                  var obj = search[0];
                  obj.short_url = root_url + obj.index;
                  delete obj.index;
                  
                    res.send(JSON.stringify(obj));
                    db.close();
                }
                else{
                var newIndex = 0;
                db.collection('seq').update({_id:"users"}, {$inc: {seq:1}},
                function(err, data) {
                    db.collection('seq').find({
                        "_id": "users"
                    }).toArray(function(err, seqArray) {
                        newIndex = seqArray[0].seq;
                        db.collection('urls').insert({
                            "original_url": str,
                            "index": Base62.encode(newIndex)
                        }, function(err, data) {
                            if (err) {
                                console.log("Error inserting the date!");
                                db.close();
                            } else {
                                console.log(data);
                                db.collection('urls').find({
                                    "original_url": str
                                },{ original_url: 1, index: 1, _id:0 }).toArray(function(err, data) {
                                    if (err) {
                                        console.log(err);
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(JSON.stringify({
                                            "error": "Internal Server Error"
                                        }));
                                    } else {
                                        res.setHeader('Content-Type', 'application/json');
                                        var obj = data[0];
                                        obj.short_url = root_url + obj.index;
                                         delete obj.index;
                                      res.send(JSON.stringify(obj));
                                    }
                                    db.close();
                                });

                                //  db.close();
                            }
                        });
                    });
                });
                                  
                }
              });





            } else {
                db.collection('urls').find({index:str}).toArray(function(err, data){
                  if(data.length>0){
                    db.close();
                      res.redirect(data[0].original_url);
                   
                  }
                  else{
                       res.setHeader('Content-Type', 'application/json');
                       if(/^[A-Za-z0-9]+$/g.test(str)){
                       res.send(JSON.stringify({"error": "This url is not on the database."}));
                       }else{
                       res.send(JSON.stringify({"error": "Wrong url format, make sure you have a valid protocol and real site."}));
                       }
                db.close();

                  }
                });

            }


        }
    });


});

app.use(function(req, res, next) {
    res.status(404);
    res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
    if (err) {
        res.status(err.status || 500)
            .type('txt')
            .send(err.message || 'SERVER ERROR');
    }
});

app.listen(process.env.PORT || 5000);
