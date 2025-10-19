/*
KWADA LICENSE (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import questionsRouter from "./routes/questions";
import roomsRouter from "./routes/rooms";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:1313",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionsRouter);
app.use("/api/rooms", roomsRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Collaborative coding rooms
interface User {
    id: string;
    username: string;
    color: string;
    cursor?: { line: number; column: number };
}

interface Room {
    id: string;
    name: string;
    users: Map<string, User>;
    code: string;
    language: string;
    question?: string;
}

const rooms = new Map<string, Room>();

// Generate random room code (6 characters)
function generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Generate random color for user cursor
function generateUserColor(): string {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Create a new room
    socket.on("create_room", ({ username, questionSlug }) => {
        const roomCode = generateRoomCode();
        const room: Room = {
            id: roomCode,
            name: `${username}'s Room`,
            users: new Map(),
            code: '',
            language: 'javascript',
            question: questionSlug
        };

        const user: User = {
            id: socket.id,
            username,
            color: generateUserColor()
        };

        room.users.set(socket.id, user);
        rooms.set(roomCode, room);

        socket.join(roomCode);
        socket.emit("room_created", {
            roomCode,
            user,
            room: {
                id: room.id,
                name: room.name,
                users: Array.from(room.users.values()),
                code: room.code,
                language: room.language,
                question: room.question
            }
        });

        console.log(`🏠 Room created: ${roomCode} by ${username}`);
    });

    // Join an existing room
    socket.on("join_room", ({ roomCode, username }) => {
        const room = rooms.get(roomCode);

        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        const user: User = {
            id: socket.id,
            username,
            color: generateUserColor()
        };

        room.users.set(socket.id, user);
        socket.join(roomCode);

        // Notify user they joined
        socket.emit("room_joined", {
            user,
            room: {
                id: room.id,
                name: room.name,
                users: Array.from(room.users.values()),
                code: room.code,
                language: room.language,
                question: room.question
            }
        });

        // Notify others in the room
        socket.to(roomCode).emit("user_joined", { user });

        console.log(`👋 ${username} joined room ${roomCode}`);
    });

    // Handle code changes
    socket.on("code_change", async ({ roomCode, code, cursorPosition }) => {
        const room = rooms.get(roomCode);
        if (!room) return;

        room.code = code;

        // Update cursor position
        const user = room.users.get(socket.id);
        if (user && cursorPosition) {
            user.cursor = cursorPosition;
        }

        // Persist code to database
        try {
            await prisma.room.update({
                where: { code: roomCode },
                data: { currentCode: code }
            });
        } catch (error) {
            console.error("Error saving code:", error);
        }

        // Broadcast to others in room
        socket.to(roomCode).emit("code_updated", {
            code,
            userId: socket.id,
            cursorPosition
        });
    });

    // Handle cursor movement
    socket.on("cursor_move", ({ roomCode, cursorPosition }) => {
        const room = rooms.get(roomCode);
        if (!room) return;

        const user = room.users.get(socket.id);
        if (user) {
            user.cursor = cursorPosition;
        }

        socket.to(roomCode).emit("cursor_updated", {
            userId: socket.id,
            username: user?.username,
            color: user?.color,
            cursorPosition
        });
    });

    // Handle chat messages
    socket.on("send_message", async ({ roomCode, message }) => {
        const room = rooms.get(roomCode);
        if (!room) return;

        const user = room.users.get(socket.id);
        if (!user) return;

        const chatMessage = {
            id: Date.now().toString(),
            userId: socket.id,
            username: user.username,
            color: user.color,
            message,
            timestamp: new Date().toISOString()
        };

        // Persist message to database
        try {
            const dbRoom = await prisma.room.findUnique({ where: { code: roomCode } });
            if (dbRoom) {
                await prisma.message.create({
                    data: {
                        roomId: dbRoom.id,
                        userId: user.id,
                        username: user.username,
                        content: message,
                        type: "text"
                    }
                });
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }

        // Broadcast to everyone in room including sender
        io.to(roomCode).emit("message_received", chatMessage);
    });

    // Handle language change
    socket.on("language_change", async ({ roomCode, language }) => {
        const room = rooms.get(roomCode);
        if (!room) return;

        room.language = language;

        // Persist language to database
        try {
            await prisma.room.update({
                where: { code: roomCode },
                data: { currentLanguage: language }
            });
        } catch (error) {
            console.error("Error saving language:", error);
        }

        socket.to(roomCode).emit("language_updated", { language });
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
        console.log(`🔌 User disconnected: ${socket.id}`);

        // Find and remove user from all rooms
        rooms.forEach(async (room, roomCode) => {
            if (room.users.has(socket.id)) {
                const user = room.users.get(socket.id);
                room.users.delete(socket.id);

                // Update member status in database
                try {
                    const dbRoom = await prisma.room.findUnique({ where: { code: roomCode } });
                    if (dbRoom && user) {
                        await prisma.roomMember.updateMany({
                            where: {
                                roomId: dbRoom.id,
                                userId: user.id
                            },
                            data: {
                                isOnline: false,
                                lastSeenAt: new Date()
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error updating member status:", error);
                }

                // Notify others
                socket.to(roomCode).emit("user_left", {
                    userId: socket.id,
                    username: user?.username
                });

                // Delete empty rooms (from memory, not database)
                if (room.users.size === 0) {
                    rooms.delete(roomCode);
                    console.log(`🗑️ Room ${roomCode} removed from memory (empty)`);
                }
            }
        });
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server ready`);
});
