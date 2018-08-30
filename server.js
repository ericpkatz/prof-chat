const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path');
const { Server } = require('ws');


const server = app.listen(port, ()=> console.log(`listening on port ${port}`));

const wss = new Server({ server });

const filterClient = (listeners, client)=> listeners.filter(listener => listener !== client);

const broadcast = (listeners, client, message)=> {
  filterClient(listeners, client).forEach( listener => {
      listener.send(JSON.stringify(message));
  });
};

const addClient = (listeners, client)=> {
  return [...listeners, client];
}

let listeners = [];
const messages = [];
wss.on('connection', (client)=> {
  listeners = addClient(listeners, client);
  client.send(JSON.stringify({ messages }));
  client.on('message', function(data){
    const parsed = JSON.parse(data);
    messages.push(parsed.message);
    broadcast(listeners, client, parsed);
  });
  client.on('close', ()=> {
    listeners = filterClient(listeners, client);
  });
});

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));


