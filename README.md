[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/Geovation/glabs-canvas-share)

# Collaborative Text Editing Site

## Running Locally

```
cd app
npm install
npm run build
npm run start
```

## Running Locally with Docker

```
docker-compose up
```

## Deployment

First [install now Desktop](https://zeit.co/download) and you get the `now` command line tool.

Deploy a new instance like this:

```
now --public
now alias set glabs-canvas-share-cxflfbmoef.now.sh canvas.glabs.jimmyg.org
```

Now visit the URL created by the deployment.
