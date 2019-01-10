# Collaborative Text Editing Site

## Running Locally

Create a `.env` file in both the project root directory and the `app` directory.  The `.env` file in the root directory should have the following variables set:

```
ME_CONFIG_BASICAUTH_USERNAME=<auth username for Mongo Express>
ME_CONFIG_BASICAUTH_PASSWORD=<auth password for Mongo Express>
ME_CONFIG_MONGODB_ADMINUSERNAME=<admin user for MongoDB, as specified in app/.env>
ME_CONFIG_MONGODB_ADMINPASSWORD=<admin password for MongoDB, as specified in app/.env>
ME_CONFIG_MONGODB_ENABLE_ADMIN=true
ME_CONFIG_MONGODB_SERVER=mongo
ME_CONFIG_SITE_COOKIESECRET=<a secret>
ME_CONFIG_SITE_SESSIONSECRET=<another secret>
```

The `app/.env` file should contain the following varibles:

```
MONGODB_ADMIN_USER=<admin user for MongoDB>
MONGODB_ADMIN_PASS=<admin password for MongoDB>
MONGODB_APPLICATION_DATABASE=sharedb
MONGODB_APPLICATION_USER=<application user for shareDB>
MONGODB_APPLICATION_PASS=<application password for shareDB>
```

If you have not already built and run the MongoDB container do so before running the app locally - it takes it a while to create the users and database needed for the app:

```
docker-compose up --build mongo
```

If you want to check that the database has been successfully created you can run the Mongo Client:

```
docker-compose up --build mongo-express
```

You'll need to use the ME_CONFIG_BASICAUTH_USERNAME/ME_CONFIG_BASICAUTH_PASSWORD from .env to log in to the client.

### Set up HTTPS certificates

Make sure that you can customise your networking so that `www.sharedb.localhost` can point to `127.0.0.1` (for sharedb, by editing the `/etc/hosts` file on a Mac).

The app runs behind a simple reverse SSH proxy. This proxy terminates https and connects to all downstream services using http. In order to use HTTPS you will have to create some credentials:

- Create a `sni` directory within the `proxy` directory

For local testing, let's imagine you want to use the domain `www.sharedb.localhost`.

You can create certificates as described here:

* [https://letsencrypt.org/docs/certificates-for-localhost/](https://letsencrypt.org/docs/certificates-for-localhost/)

You'll need to put them in the directory `sni` you have just created. Here's some code that does this:

```
openssl req -x509 -out proxy/sni/cert.pem -keyout proxy/sni/key.pem \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=www.sharedb.localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=www.sharedb.localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:www.sharedb.localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Now edit your `/etc/hosts` so that your domain really points to `127.0.0.1` for local testing. You should have a line that looks like this:

```
127.0.0.1   localhost www.sharedb.localhost sharedb.localhost
```

Now start the gateway:

```
cd proxy
npm install
npm start
```

You're now ready to run the collaborative editor:

```
cd ../app
npm install
npm run build:start
```

## Running Locally with Docker

As with running locally, build and run the MongoDB container by itself before starting the stack (see above).

Now run the stack:

```
docker-compose build gateway-local share-db-local
# build mongo-express if you haven't done so already:
docker-compose build mongo-express
docker-compose up -d gateway-local
```
