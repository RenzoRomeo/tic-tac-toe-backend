import { Server } from 'socket.io';

const usersMap = new Map<string, string>();

/* const port = process.env.PORT ? parseInt(process.env.PORT) : 8000; */
const port = 8000;
const io = new Server(port, {
  cors: {
    origin: [
      'https://tic-tac-toe-gray-five.vercel.app/',
      'https://tic-tac-toe-renzoromeo.vercel.app/',
      'https://tic-tac-toe-git-main-renzoromeo.vercel.app/',
    ],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected [${socket.id}]`);

  const other = socket.handshake.query.other as string;

  if (other !== '') {
    if (!usersMap.has(other)) socket.emit('error', "User doesn't exist");
    else if (usersMap.get(other)) socket.emit('error', 'User already playing');
    else {
      usersMap.set(other, socket.id);
      usersMap.delete(socket.id);
      io.to(other).emit('otherJoined', socket.id);
      socket.emit('youJoined', other);
    }
  } else usersMap.set(socket.id, '');

  socket.on('finishedGame', (otherUser: string) => {
    socket.to(otherUser).emit('');
  });

  socket.on('newMove', (args: { otherUser: string; newSquares: any }) => {
    const { otherUser, newSquares } = args;
    socket.to(otherUser).emit('getMove', newSquares);
  });

  socket.on('disconnected', (otherUser: string) => {
    socket.to(otherUser).emit('reset');
    usersMap.delete(otherUser);
  });

  console.log(usersMap);

  socket.on('disconnect', () => {
    console.log(`User disconnected [${socket.id}]`);
    const otherUser =
      usersMap.get(socket.id) ||
      [...usersMap.entries()].filter(([, v]) => v === socket.id)[0];
    socket.to(otherUser).emit('reset');
    usersMap.delete(socket.id);
  });
});
