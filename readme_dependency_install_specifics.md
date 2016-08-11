Readme dependencies

---
### Windows ###

1. You will need a terminal tool for Windows. I used [Git Bash][] to test these
   steps, but [Cygwin][] or another unix like editor should work fine too.
  1. Download [Git Bash][].
  2. Click **Next** on the welcome screen.
  3. Click **Next** to acknowledge the license.
  4. Click **Next** to keep the default directory.
  5. Click **Next** to Select Components.  
     You may add Quick Launch and Desktop icons here if you'd like.
  6. Click **Next** to confirm the Start Menu Folder.
  7. PATH environment. I recommend the __last option__ here to include Unix
     tools, but if you don't understand what that entails use the
     _second option_ which still adds Git to your system PATH then click
     **Next**.
  8. Line Ending Conversion. Keep the first option selected, click **Next**.
  9. Click **Finish** when the installation is complete.

1. Install the newest release of [Node][] for Windows, using the Windows
   Installer (.msi).
  1. Click **Next** on the welcome screen.
  1. Accept the License Agreement, then click **Next**.
  1. Click **Next** to keep the default directory.
  1. Click **Next** to intall the default features of Node.
  1. Click **Install** to begin the installation.
  1. Click **Finish** when the installation is complete.

1. Close and re-open your terminal so that your new PATH is loaded.  
   Make sure to navigate back to your `geomag-baseline-calculator` project
   directory. `git config --global url."https://".insteadOf git://`  

[Git Bash]: http://git-scm.com/download/win
[Cygwin]: http://cygwin.com/install.html
[Node]: http://nodejs.org/download/

1. Install PostgreSQL and PostGIS (?)

1. Install and setup Docker
  1. install Docker `https://www.docker.com`
  2. Build a container (?)
  3. Run the container using the tag (?)
  4. Connect to running container (?)

---
### Mac ###

1. install xcode  
   `https://developer.apple.com/xcode/`

2. install homebrew  
   `http://mxcl.github.io/homebrew/`

3. Use homebrew to install node and git  
   `brew install node`

3. Use npm to install grunt.
   `npm install -g grunt-cli`  

4. Update paths as needed in your `~/.bash_profile`:  
   `# brew installed binaries`  
   `export PATH=$PATH:/usr/local/bin`  
   `# npm installed binaries`  
   `export PATH=$PATH:/usr/local/share/npm/bin`  

5. Close and re-open your terminal so that your new PATH is loaded.  
   Make sure to navigate back to your `geomag-baseline-calculator` project
   directory.

6. Install PostgreSQL and PostGIS
  1. Install

    brew install postgresql postgis

    After running `brew install postgresql`, the terminal will output directions
    that you will use to get your installation up and running.

  2. Create/Upgrade a Database

    If this is your first install, create a database with:
    ```bash
    $ initdb \
      --auth=md5 \
      --auth-host=md5 \
      --auth-local=md5 \
      --pgdata=<db_directory> \
      --encoding=UTF8 \
      --locale=en_US.UTF-8 \
      --username=<db_admin_username>
      --pwprompt
    ```
    You will need to replace the `<db_directory>` and `<db_admin_username>` with
    actual values that make sense for your environment. The `<db_directory>` is
    a fully-qualified path name to a directory. This directory is where data
    files for the database installation will be located. The
    `<db_admin_username>` is the name of the administrator for the database
    installation. This command will prompt you to enter a password for the
    `<db_admin_username>`.

    > Note: We suggest defining a `.data` directory at the root level of this
    > application for the `<db_directory>`.

  3. Start/Stop PostgreSQL

    After running the `initdb` command, you should see a success message. Use the
    `pg_ctl` utility to start the database.

    ```bash
    $ pg_ctl -D <db_directory> start
    ```

    You will need to replace the `<db_directory>` with the same value you used
    when running the `initdb` command (above). Alternatively, you can set the
    `PGDATA` environment variable to this value and you will not need to specify
    the `-D <db_directory>` flag.

  4. Login

    Login to the default `postgres` database with the user that created the
    database.

        psql postgres

    > Note: PostgreSQL will create the default database `postgres`, which you
    > can access with the same user that you used to create the database. If the
    > database server successfully started you may login using the command,
    > `psql postgres <username>`

7. Install and setup Docker
  1. install Docker `https://www.docker.com`
  2. Build a container
    From root of project, run:
    ```
    docker build -t earthquake-hazard-probabilistic-db:version .
    ```
  3. Run the container using the tag
    ```
    docker run -it -p ????:???? earthquake-hazard-probabilistic-db:version
    ```
  4. Connect to running container (?)
