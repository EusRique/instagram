var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var obejctId = require('mongodb').ObjectId;

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

app.get('/api/:id', function(req, res) {
    db.open(function(error, mongoclient) {
        mongoclient.collection('postagens', function(error, collection) {
            collection.find(obejctId(req.params.id)).toArray(function(error, results) {
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

app.put('/api/:id', function(req, res) {
    db.open(function(error, mongoclient) {
        mongoclient.collection('postagens', function(error, collection) {
            collection.update(
                { _id : obejctId(req.params.id)}, //query de pesquisa
                { $set : {titulo: req.body.titulo}}, //instrução de atualiazação do(s) doc(s)
                { }, //Mute identifica se devemos atualizar um unico parametro ou todos
                function(error, records) {
                    if (error) {
                        res.json(error)
                    } else {
                        res.json({'sucesso' : 'Uhuul post atualizado com sucesso!!!'});
                    }
                    mongoclient.close();
                }
            );
        });
    });
});

app.delete('/api/:id', function(req, res) {
    db.open(function(error, mongoclient) {
        mongoclient.collection('postagens', function(error, collection) {
            collection.remove({ _id : obejctId(req.params.id )}, function(error, records) {
                if (error) {
                    res.json(error);
                } else {
                    res.json({'sucesso' : 'Post removido com sucesso!!!'})
                }
                mongoclient.close();
            });
        });
    });
});