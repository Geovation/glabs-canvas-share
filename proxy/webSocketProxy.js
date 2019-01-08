var fs = require('fs');
var httpProxy = require("http-proxy");
var target = process.env.TARGET || 'localhost';
var proxy = httpProxy.createProxyServer({
  ssl: {
    key: fs.readFileSync('sni/key.pem', 'utf8'),
    cert: fs.readFileSync('sni/cert.pem', 'utf8')
  },
  target: `http://${target}:8080`,
  ws: true
});

proxy.listen(443);

//
// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  console.log({err});
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});
 
//
// Listen for the `proxyRes` event on `proxy`.
//
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});
 
//
// Listen for the `open` event on `proxy`.
//
proxy.on('open', function (proxySocket) {
  // listen for messages coming FROM the target here
  proxySocket.on('data', function (err, req, res) {
    console.log(arguments);
  });
});
 
//
// Listen for the `close` event on `proxy`.
//
proxy.on('close', function (res, socket, head) {
  // view disconnected websocket connections
  console.log('Client disconnected');
});
