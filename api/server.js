var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var obejctId = require('mongodb').ObjectId;
var multiparty = require('connect-multiparty');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(multiparty());

var port = 3000;

app.listen(port);

db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}
)

console.log('Executando servidor HTTP!!!');

app.post('/api', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    var date = new Date();
    time_stamp = date.getTime();

    var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;

    var path_origem = req.files.arquivo.path;
    var path_destino = './uploads/' + url_imagem;

    fs.rename(path_origem, path_destino, function(err) {
        if (err) {
            res.status(500).json({error: err});

            return;
        }

        var dados = {
            url_imagem: url_imagem,
            titulo: req.body.titulo
        }

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
});

app.get('/api', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    
    db.open(function(error, mongoclient) {
        mongoclient.collection('postagens', function(error, collection) {
            collection.find().toArray(function(error, results) {
                if (error) {
                    res.json({'error' : 'Ops, algo deu errado!!!'});
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
                    res.json({'error' : 'Ops, algo deu errado!!!'});
                } else {
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

app.get('/imagens/:imagem', function(req, res){
    var img = req.params.imagem;

    fs.readFile('./uploads/' + img, function(err, content){
        if(err){
            res.status(400).json({ err });
            return;
        }

        res.writeHead(200, { 'content-type' : 'image/jpg' });
        res.end(content);

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
                        res.json({'error' : 'Ops, algo deu errado!!!'})
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
                    res.json({'error' : 'Ops, algo deu errado!!!'});
                } else {
                    res.json({'sucesso' : 'Post removido com sucesso!!!'})
                }
                mongoclient.close();
            });
        });
    });
});