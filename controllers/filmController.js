'use strict';

const {pool} = require('../pool/pool.js')

class FilmController {

    static getFilms(id) {
        const query = `select films.id as id, film_name, year, array_agg(genre_name) as genres from films
                     join film_genres as fg on films.id = fg.film_id
                     join genres as g on fg.genre_id = g.id
                     ${id ? `where films.id = ${id}`: ''}
                     group by films.id, film_name, year
                     order by films.id`


        return pool.query(query).then(response => {
            return JSON.stringify(response.rows);
        })
    }

    static insertFilms(films) {
        films = JSON.parse(films);

        let res = [];

        for (let film of films) {
            const query = `insert into films (film_name, year)
                           values ('${film.film_name}', ${film.year})
                           on conflict do nothing
                           returning id`

            let newRow = pool.query(query)
                .then(response => {
                    const id = response.rows.at(0).id;

                    for (let genre_id of film.genres) {
                        let linkQuery = `insert into film_genres (film_id, genre_id)
                                         values (${id}, ${genre_id})
                                         on conflict do nothing`;

                        pool.query(linkQuery)
                            .catch(error => console.log(`${error.message}\nЖанра с id=${genre_id} не существует`));
                    }

                    return this.getFilms(id);
                })
                .catch(error => {
                    console.log(`${error.message}\nДанный фильм уже существует\n${film.film_name} ${film.year}\n`);
                    return JSON.stringify([]);
                })

            res.push(newRow);
        }

        return Promise.all(res).then(values => {
            values = values.map(row => JSON.parse(row).at(0));
            values = values.filter(row => {
                return row !== undefined;
            })

            return JSON.stringify(values);
        })

    }

    static updateFilms(films) {
        films = JSON.parse(films);

        const res = [];

        for (let film of films) {
            const genres = film.genres;
            const id = film.id

            const query = `update films set 
                           film_name='${film.film_name}', year=${film.year}
                           where id=${id}
                           returning *`

            let updatedRow = pool.query(query)
                .then(() => {
                    const deleteLinksQuery = `delete from film_genres where film_id=${id}`
                    return pool.query(deleteLinksQuery)
                })
                .then(() => {
                    const links = []

                    for (let genre_id of genres) {
                        let makeLinksQuery = `insert into film_genres (film_id, genre_id)
                            values (${id}, ${genre_id})`;

                        links.push(pool.query(makeLinksQuery))
                    }

                    return Promise.all(links)
                })
                .catch( error => {
                    console.log(`${error.message}\nФильм с film_name=${film.film_name} уже существует под другим id`)
                })

            res.push(updatedRow)
        }

        return Promise.all(res)
    }

    static deleteFilms(films_indexes) {
        films_indexes = JSON.parse(films_indexes);

        let query = `delete from films where id in (${films_indexes.join(',')})`

        return pool.query(query);
    }
}

module.exports = {FilmController};