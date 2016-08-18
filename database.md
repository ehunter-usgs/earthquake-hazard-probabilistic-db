# Database Setup

This README will walk you through the process of setting up the application:
 1. create database
 2. load schema
 3. load data

### Create Database

While the database server is [currently running], you still need to create a
database in the server that can be used by the application. For database
access, you will not want to use the database administrator credentials but
rather a dedicated username/password for this application.

[currently running]:(readme_dependency_install_specifics.md)

```bash
$ mkdir <db_directory>/<db_name>
$ psql postgres

postgres=# CREATE USER <db_user> WITH ENCRYPTED PASSWORD '<db_pass>';
postgres=# CREATE DATABASE <db_name>
  WITH OWNER <db_user>;
postgres=# \c <db_name>;
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_name>`) with the actual value that makes sense in your environment.

### Load the Schema

```bash
$ psql postgres <db_name>

<db_name>=# \i <application_directory>/sql/schema.sql
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_name>`) with the actual value that makes sense in your environment.

### Load the Data

```bash
$ psql postgres <db_name>

<db_name>=# \i <application_directory>/sql/metadata.sql
<db_name>=# \q
$
```

  > Note: You will need to replace any value contained in angle brackes (eg.
  > `<db_name>`) with the actual value that makes sense in your environment.
