CREATE DATABASE decisionapp;

CREATE TABLE restaurants(
  toeat_id SERIAL PRIMARY KEY,
  restaurant_name VARCHAR(255),
  user_id INTEGER NOT NULL REFERENCES credentials(user_id)
);



CREATE TABLE credentials (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
