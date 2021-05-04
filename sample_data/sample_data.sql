DROP TABLE IF EXISTS users;
CREATE TABLE users (
id serial not NULL,
login text not NULL,
password text not NULL
);

INSERT INTO users VALUES(0, 'test', 'sha256$kMVdLLCl$e9db1c90aaaa60e9939e1a2e1b950e2a29be457b9073d0210eef84d68a773217');
SELECT pg_catalog.setval('users_id_seq', 1, true);


