drop table if exists  film_genres;
drop table if exists  films;
drop table if exists  genres;

create table public.films
(
    id serial primary key ,
    film_name varchar not null,
    year integer not null
);

create table public.genres
(
    id serial primary key ,
    genre_name varchar unique not null
);

create table public.film_genres
(
    film_id integer not null
        references films (id)
        on delete cascade
        on update cascade,
    genre_id integer not null
        references genres (id)
        on delete cascade
        on update cascade,
    primary key (film_id, genre_id)
);


insert into films (film_name, year)
values
    ('Зеленая миля', 1999),
    ('Список Шиндлера', 1993),
    ('Побег из Шоушенка', 1994),
    ('Форрест Гамп', 1994),
    ('Тайна Коко', 2017);

insert into genres (genre_name)
values
    ('Драма'),         -- 1
    ('Фентези'),       -- 2
    ('Криминал'),      -- 3
    ('Биография'),     -- 4
    ('История'),       -- 5
    ('Военный'),       -- 6
    ('Комедия'),       -- 7
    ('Мелодрама'),     -- 8
    ('Мультфильм'),    -- 9
    ('Приключения'),   -- 10
    ('Семейный'),      -- 11
    ('Музыка'),        -- 12
    ('Боевик');        -- 13



insert into film_genres (film_id, genre_id)
values
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 4),
    (2, 5),
    (2, 6),
    (3, 1),
    (4, 1),
    (4, 7),
    (4, 8),
    (4, 5),
    (4, 6),
    (5, 2),
    (5, 7),
    (5, 9),
    (5, 10),
    (5, 11),
    (5, 12);

create index on film_genres (film_id);
create index on film_genres (genre_id);
create unique index on films (film_name, year);

