const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path');
const { Server } = require('ws');


const server = app.listen(port, ()=> console.log(`listening on port ${port}`));

const wss = new Server({ server });

let listeners = [];
const messages = [];
wss.on('connection', (client)=> {
  listeners.push(client);
  client.send(JSON.stringify({ messages }));
  client.on('message', function(data){
    const message = JSON.parse(data);
    messages.push(message.message);
    listeners.filter( listener=> listener !== client).forEach( listener => {
      listener.send(JSON.stringify(message));
    });
  });
  client.on('close', ()=> {
    listeners = listeners.filter(listener => listener !== client);
  });
});

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));


