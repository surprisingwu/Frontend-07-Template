const http = require('http')

http.createServer((request, response) => {
  let body = []

  request.on('error', err => {
    console.log(err);
  }).on('data', chunk => {

    body.push(chunk.toString())
  }).on('end', () => {
    body = Buffer.concat([Buffer.from(body.toString())]).toString()

    console.log('body:', body);
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(`<html maaa='a' >
    <head>
      <style>
        #container{
          display: flex;
          width: 300px;
          height: 400px;
          background-color: red;
        }
        #myid {
          flex: 1;
        }
        #test{
          width: 100px;
          height: 200px;
        }
      </style>
    </head>
    <body>
      <div id="container">
        <div id="myid"></div>
        <div id="test"></div>
      </div>
    </body>
    </html>`)
  })
}).listen(8888, () => {
  console.log('server started');
})
