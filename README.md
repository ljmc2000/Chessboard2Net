# Chessboard2Net

At some point in third year of collage I was given a rather open ended assignment for android programming, and decided that what I wanted to make was a network multiplayer game. This is that same concept but written in nodejs and Angular 17. It is not cross compatible with it's older sibling. It turns out when you write a protocol based on serializing java objects it's not very intercompatible with other languages. The browser's limit to only use websockets probably didn't help either, but there's nothing I could have done about that save for writing a probably doomed W3 proposal.

# Running

The frontend is angular, so you should just be able to just run `ng --serve`.

I've been running the backend with node [21.7.3]. You'll need to provide database configuration with environment variables.
```
npm install;
export CHESSBOARDNET_DATABASE_USER='chessmaster';
export CHESSBOARDNET_DATABASE_PASSWORD='********';
export CHESSBOARDNET_DATABASE_HOST='mypostgresdatabse.foo';
export CHESSBOARDNET_DATABASE_NAME='the_chess_database';
node index.js;
```

# Building for production
```
ng build;
cd frontend/dist/chessboard2-net;
tar cf chessboard2net-frontend.tar browser;
xz chessboard2net-frontend.tar;
```
Then deploy to nginx with the config attached. Note: If serving the page as https you'll have to patch `chess-websocket-handler.ts` to use wss instead of ws. Otherwise it will just serve a blank page.

The backend should work the same as above, just add the extra environment variable `NODE_ENV='production'`

# See it in action
At time of writing there's a live instance [here](https://chessboardnet.delilahsthings.ie). I might not maintain it forever, but for now feel free to mess around with it.