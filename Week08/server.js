const http = require('http')

http.createServer((request, response) => {
  let body = []
  console.log(2222222);
  request.on('error', err => {
    console.log(err);
  }).on('data', chunk => {
    console.log(11111111);
    body.push(chunk.toString())
  }).on('end', () => {
    body = Buffer.concat([Buffer.from(body.toString())]).toString()

    console.log('body:', body);
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(' Hello World \n')
  })
}).listen(8888, () => {
  console.log('server started');
})
