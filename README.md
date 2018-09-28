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
export ENV=local
docker build . -t glabs-canvas-share:initial
docker run -p8080:8080 glabs-canvas-share:initial
```

## Deployment

First [install now Desktop](https://zeit.co/download) and you get the `now` command line tool.

Deploy a new instance like this:

```
now --public
now alias set glabs-canvas-share-cxflfbmoef.now.sh canvas.glabs.jimmyg.org
```

Now visit the URL created by the deployment.
