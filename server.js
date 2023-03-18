'use strict';

const http = require('http');
const url = require('url');
const {FilmController} = require('./controllers/filmController.js');
const {GenresController} = require('./controllers/genresController.js');


const server = http.createServer();

server.on('request', (req, res) => {
    function _200(response) {
        res.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
        res.end(response);
    }

    function _201(response) {
        res.writeHead(201, {'Content-Type': 'text/json; charset=utf-8'});
        res.end(response);
    }

    function _400(error) {
        if (error) console.log(error.message);
        res.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('400 Bad Request');
    }

    function _405() {
        res.writeHead(405, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('405 Method Not Allowed');
    }

    const method = req.method;
    const urlReq = url.parse(req.url, true);
    const id = urlReq.query.id;
    const table = urlReq.query.table;

    if (method === 'GET') {

        if (table === 'genres') {
            GenresController.getGenres(id)
                .then(response => {
                    _200(response);
                })
                .catch(error => {
                    _400(error);
                })

        } else if (table === 'films') {
            FilmController.getFilms(id)
                .then(response => {
                    _200(response);
                })
                .catch(error => {
                    _400(error);
                })
        } else {
            _400();
        }

    } else if (method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', () => {
            if (table === 'genres') {
                GenresController.insertGenres(body)
                    .then(response => {
                        _200(response);
                    })
                    .catch(error => {
                        _400(error);
                    })
            } else if (table === 'films') {
                FilmController.insertFilms(body)
                    .then(response => {
                        _201(response);
                    })
                    .catch(error => {
                        _400(error);
                    })

            } else {
                _400();
            }
        })

    } else if (method === 'PUT') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', () => {
            if (table === 'genres') {
                GenresController.updateGenres(body)
                    .then(() => {
                        _200(`200 ok`);
                    })
                    .catch(error => {
                        _400(error);
                    })
            } else if (table === 'films') {
                FilmController.updateFilms(body)
                    .then(() => {
                        _200(`200 ok`);
                    })
                    .catch(error => {
                        _400(error);
                    })

            } else {
                _400();
            }
        })

    } else if (method === `DELETE`) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', () => {
            if (table === 'genres') {
                GenresController.deleteGenres(body)
                    .then(() => {
                        _200(`200 ok`);
                    })
                    .catch(error => {
                        _400(error);
                    })
            } else if (table === 'films') {
                FilmController.deleteFilms(body)
                    .then(() => {
                        _200(`200 ok`);
                    })
                    .catch(error => {
                        _400(error);
                    })

            } else {
                _400();
            }
        })
    } else {
        _405();
    }


})

server.listen(8080, () => console.log('server is running'));