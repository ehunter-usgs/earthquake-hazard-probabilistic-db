DROP TABLE IF EXISTS curve CASCADE;
DROP TABLE IF EXISTS dataset CASCADE;
DROP TABLE IF EXISTS region CASCADE;
DROP TABLE IF EXISTS edition CASCADE;
DROP TABLE IF EXISTS vs30 CASCADE;
DROP TABLE IF EXISTS imt CASCADE;

CREATE TABLE imt (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT imt_identifier UNIQUE (value)
);

CREATE TABLE vs30 (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT vs30_identifier UNIQUE (value)
);

CREATE TABLE edition (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,

  CONSTRAINT edition_identifier UNIQUE (value)
);

CREATE TABLE region (
  id SERIAL NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  display TEXT NOT NULL,
  displayorder INTEGER NOT NULL,
  minlatitude DECIMAL(5, 2) NOT NULL,
  maxlatitude DECIMAL(5, 2) NOT NULL,
  minlongitude DECIMAL(5, 2) NOT NULL,
  maxlongitude DECIMAL(5, 2) NOT NULL,
  gridspacing DECIMAL(5, 2) NOT NULL,

  CONSTRAINT region_identifier UNIQUE (value),
  CONSTRAINT region_parameters UNIQUE (minlatitude, maxlatitude, minlongitude,
    maxlongitude, gridspacing)
);


CREATE TABLE dataset (
  id SERIAL NOT NULL PRIMARY KEY,
  imtid INTEGER NOT NULL REFERENCES imt (id),
  vs30id INTEGER NOT NULL REFERENCES vs30 (id),
  editionid INTEGER NOT NULL REFERENCES edition (id),
  regionid INTEGER NOT NULL REFERENCES region (id),
  iml DECIMAL ARRAY,

  CONSTRAINT dataset_identifier UNIQUE (imtid, vs30id, editionid, regionid)
);

CREATE TABLE curve (
  id SERIAL NOT NULL PRIMARY KEY,
  datasetid INTEGER NOT NULL REFERENCES dataset (id),
  latitude DECIMAL(5, 2) NOT NULL,
  longitude DECIMAL(5, 2) NOT NULL,
  afe DECIMAL ARRAY NOT NULL,

  CONSTRAINT curve_identifier UNIQUE (datasetid, latitude, longitude)
);
