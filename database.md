# Database Setup

This README will walk you through the process of setting up the application:
 1. create database
 2. load schema
 3. load data

### Create Database

While the database server is [currently running], you still need to create a
database in the server that can be used by the application. We recommend a
dedicated tablespace be assigned to this database. Additionally, for database
access, you will not want to use the database administrator credentials but
rather a dedicated username/password for this application.

[currently running]:(readme_dependency_install_specifics.md)

```bash
$ mkdir <db_directory>/<db_name>
$ psql postgres

postgres=# CREATE USER <db_user> WITH ENCRYPTED PASSWORD '<db_pass>';
postgres=# CREATE TABLESPACE <db_name>_ts
  OWNER <db_user>
  LOCATION '<db_directory>/<db_name>';
postgres=# CREATE DATABASE <db_name>
  WITH OWNER <db_user>
  TABLESPACE <db_name>_ts;
postgres=# \c <db_name>;
<db_name>=# CREATE SCHEMA <db_schema> AUTHORIZATION <db_user>;
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_schema>`) with the actual value that makes sense in your environment.

### Load the Schema

```bash
$ psql postgres <db_name>

<db_name>=# SET search_path TO <db_schema>;
<db_name>=# \i <application_directory>/sql/schema.sql
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_schema>`) with the actual value that makes sense in your environment.

### Load the Data

```bash
$ psql postgres <db_name>

<db_name>=# SET search_path TO <db_schema>;
<db_name>=# \i <application_directory>/sql/metadata.sql
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_schema>`) with the actual value that makes sense in your environment.
