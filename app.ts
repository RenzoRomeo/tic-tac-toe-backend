import { Server } from 'socket.io';

const usersMap = new Map<string, string>();

/* const port = process.env.PORT ? parseInt(process.env.PORT) : 8000; */
const port = 8000;
const io = new Server(port, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log(`User connected [${socket.id}]`);

  const other = socket.handshake.query.other as string;

  if (other !== '') {
    if (!usersMap.has(other)) return socket.emit('error', "User doesn't exist");
    usersMap.set(other, socket.id);
  } else usersMap.set(socket.id, '');

  console.log(usersMap);

  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.id}]`);
    usersMap.delete(socket.id);
  });
});

io.on('join', (socket) => {
  console.log();
});
