let io;
exports.socketConnection = (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: [process.env.FRONTEND_URL, process.env.SERVER_URL],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId; // Pass userId when connecting

        if (userId) {
            socket.join(userId); // Join the user to a room identified by their userId
            console.log(`User ${userId} connected and joined room`);
        }

        // Optional: Handle user disconnection
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });
};

exports.sendMessageIo = (userId, eventName, message) => {
    io.to(userId).emit(eventName, message);
}
