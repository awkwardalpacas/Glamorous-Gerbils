CREATE DATABASE nomNow;

USE nomNow;

CREATE TABLE restaurants (
  bing_id varchar NOT NULL,
  name varchar NOT NULL,
  longitude int NOT NULL,
  latitude int NOT NULL,
  PRIMARY KEY(bing_id)
);

CREATE TABLE reports (
  id int NOT NULL auto_increment,
  bing_id varchar NOT NULL,
  wait_time int NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY(bing_id) REFERENCES restaurants(bing_id)
);
