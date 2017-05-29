# WolfBeacon CMS Platform

A content management system in Angular.

## Installation

Install [Node.js](http://nodejs.org), [PHP 5.6](http://www.php.net/), [MySQL](http://www.mysql.com/) and [Composer](https://getcomposer.org/).

Install dependencies:

    npm install -g bower
    php composer.phar update
    bower install

**You must also get (or create) `db.json` and `auth.json` to run the PHP server.**

## How to start

Run the service:

    php -S 127.0.0.1:8080 -t public

Your service will run at [http://localhost:8080](http://localhost:8080).

## Docker

For convenience, a `Makefile` is included. Commands are `make build`, `make up-dev`, `make up-prod`, `make down`.

## Contributing

* Your `master` branch should point to `origin/master`.

* **NEVER EVER WORK ON `master`**. Keep the `master` branch updated with upstream `git pull upstream master`. It's only to be used a reference/starting point.

* In reference to the above point, create a different branch for the issue you are working on off your master branch like `git checkout -b username-work`.

* Whenever you begin work, be sure to `git pull --rebase upstream master`.

* When you have completed, `git push origin username-work` and issue a PR to `wolfbeacon/4_cms_website`.

* In case you have a PR pending on this branch, `checkout` to your local `master` branch, `checkout` another `work` branch and work there. Needless to say, `git pull --rebase upstream master` is always important.
