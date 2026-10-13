import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { setupRoomSocket } from './sockets/roomSocket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Setup WebSockets
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupRoomSocket(io);

const startServer = async () => {
  const isConnected = await connectDB();

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[StudySphere Server] running on http://localhost:${PORT}`);
    console.log(`[Real-Time WebSockets] Active on ws://localhost:${PORT}`);
    console.log(`[Database Connection] ${isConnected ? 'Connected' : 'Disconnected / Not configured'}`);
    console.log(`====================================================`);
  });
};

startServer();
