export DOMAIN=www.sharedb.localhost
mkdir sni
openssl req -x509 -out sni/cert.pem -keyout sni/key.pem \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=$DOMAIN" -extensions EXT -config <( \
   printf "[dn]\nCN=$DOMAIN\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:$DOMAIN\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
