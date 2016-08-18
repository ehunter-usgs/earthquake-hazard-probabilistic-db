earthquake-hazard-probabilistic-db
==================================
Seismic hazard curve database

This project loads data from files stored on an FTP server into
an existing PostgreSQL database.

Getting Started
---------------

### Prerequisites
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node](https://nodejs.org/en/download/)
- PostgreSQL Database Access
  - This can be achieved using [Docker](#docker)

### Installing
```bash
$ git clone https://github.com/usgs/earthquake-hazard-probabilistic-db.git
$ cd earthquake-hazard-probabilistic-db
$ npm install
```

Running the installation script will interactively prompt for database
access information (host, port, admin user, admin password, dbname).

Installing will (optionally):
- create a read-only user to access the data
- create tables for this dataset
- load data from an FTP site into the database

Docker
------

You can use docker to quickly create a lightweight PostgreSQL instance. The
following instructions assume you have [docker installed](https://docs.docker.com/).

```bash
$ docker run --name earthquake-hazard-probabilistic-db -p {DB_PORT}:5432 -e POSTGRES_PASSWORD={DB_ADMIN_PASSWORD} -d postgres
```
> Note: Change `{PASSWORD}` to the password you would like to use for the "postgres"
  (administrator) account.

When following this method, use the following information when configuring this
project during installation:
- DB_HOST = 127.0.0.1
- DB_PORT = `{DB_PORT}`
- DB_NAME = postgres
- DB_ADMIN_USERNAME = postgres
- DB_ADMIN_PASSWORD = `{PASSWORD}`
