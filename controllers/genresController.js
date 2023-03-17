'use strict';

const {pool} = require('../pool/pool.js')

class GenresController {

    static getGenres(id) {
        const query = `select * from genres
                     ${id ? `where id = ${id}`: ''}                     
                     order by id`


        return pool.query(query).then(response => {
            return JSON.stringify(response.rows)
        })
    }

    static insertGenres(genres) {
        genres = JSON.parse(genres);
        let query = `insert into genres (genre_name) values ('${genres.at(0)}')`
        for (let g of genres.slice(1)) {
            query += `, ('${g}')`;
        }
        query += ' on conflict do nothing returning *'

        return pool.query(query).then(response => {
            return JSON.stringify(response.rows)
        })
    }

    static updateGenres(genres) {
        genres = JSON.parse(genres);

        let res = []
        for (let g of genres) {
            const query = `update genres set genre_name='${g.genre_name}'
                  where id=${g.id} returning *`

            let updatedRow = pool.query(query)
                .then(response => {
                    return response.rows.at(0);
                })
                .catch(error => {
                    console.log(`${error.message}\nЖанра с genre_name=${g.genre_name} уже существует под другим id`)
                })
            res.push(updatedRow)

        }

        return Promise.all(res)

    }

    static deleteGenres(genres_indexes) {
        genres_indexes = JSON.parse(genres_indexes);

        let query = `delete from genres where id in (${genres_indexes.join(',')})`

        return pool.query(query);
    }
}


module.exports = {GenresController};