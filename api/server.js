var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var port = 3000;

app.listen(port);

db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}
)

console.log('Executando servidor HTTP!!!');

app.post('/api', function(req, res) {
    var dados = req.body;

    db.open(function(error, mongoclient) {
        mongoclient.collection('postagens', function(error, collection) {
            collection.insert(dados, function(error, records) {
                if (error) {
                    res.json({'error' : 'Ops, algo deu errado!!!'});
                } else {
                    res.json({'success' : 'Uhuull foto enviada com sucesso!!!'});
                }

                mongoclient.close();
            });
        });
    });
});

app.get('/api', function(req, res) {
    db.open(function(error, mongoclient) {
        mongoclient.collection('postagens', function(error, collection) {
            collection.find().toArray(function(error, results) {
                if (error) {
                    res.json(error);
                } else {
                    res.json(results);
                }
                mongoclient.close();             
            });
        });
    });
});