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

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

export interface User {
    id: string;
    username: string;
    color: string;
    cursor?: { line: number; column: number };
}

export interface Room {
    id: string;
    name: string;
    users: User[];
    code: string;
    language: string;
    question?: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    color: string;
    message: string;
    timestamp: string;
}

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    currentRoom: Room | null;
    currentUser: User | null;
    messages: ChatMessage[];
    createRoom: (username: string, questionSlug?: string) => void;
    joinRoom: (roomCode: string, username: string) => void;
    sendMessage: (message: string) => void;
    updateCode: (
        code: string,
        cursorPosition?: { line: number; column: number }
    ) => void;
    updateCursor: (cursorPosition: { line: number; column: number }) => void;
    changeLanguage: (language: string) => void;
    leaveRoom: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const SERVER_URL =
            import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
        const newSocket = io(SERVER_URL);

        newSocket.on("connect", () => {
            console.log("🔌 Connected to WebSocket server");
            setConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("🔌 Disconnected from WebSocket server");
            setConnected(false);
        });

        // Room created
        newSocket.on("room_created", ({ roomCode, user, room }) => {
            console.log("🏠 Room created:", roomCode);
            setCurrentUser(user);
            setCurrentRoom(room);
        });

        // Room joined
        newSocket.on("room_joined", ({ user, room }) => {
            console.log("👋 Joined room:", room.id);
            setCurrentUser(user);
            setCurrentRoom(room);
        });

        // User joined
        newSocket.on("user_joined", ({ user }) => {
            console.log("👋 User joined:", user.username);
            setCurrentRoom((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    users: [...prev.users, user],
                };
            });
        });

        // User left
        newSocket.on("user_left", ({ userId, username }) => {
            console.log("👋 User left:", username);
            setCurrentRoom((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    users: prev.users.filter((u) => u.id !== userId),
                };
            });
        });

        // Code updated
        newSocket.on("code_updated", ({ code }) => {
            setCurrentRoom((prev) => {
                if (!prev) return prev;
                return { ...prev, code };
            });
        });

        // Language updated
        newSocket.on("language_updated", ({ language }) => {
            setCurrentRoom((prev) => {
                if (!prev) return prev;
                return { ...prev, language };
            });
        });

        // Message received
        newSocket.on("message_received", (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        // Error
        newSocket.on("error", ({ message }) => {
            console.error("Socket error:", message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const createRoom = (username: string, questionSlug?: string) => {
        if (socket) {
            socket.emit("create_room", { username, questionSlug });
        }
    };

    const joinRoom = (roomCode: string, username: string) => {
        if (socket) {
            socket.emit("join_room", { roomCode, username });
        }
    };

    const sendMessage = (message: string) => {
        if (socket && currentRoom) {
            socket.emit("send_message", { roomCode: currentRoom.id, message });
        }
    };

    const updateCode = (
        code: string,
        cursorPosition?: { line: number; column: number }
    ) => {
        if (socket && currentRoom) {
            socket.emit("code_change", {
                roomCode: currentRoom.id,
                code,
                cursorPosition,
            });
        }
    };

    const updateCursor = (cursorPosition: { line: number; column: number }) => {
        if (socket && currentRoom) {
            socket.emit("cursor_move", {
                roomCode: currentRoom.id,
                cursorPosition,
            });
        }
    };

    const changeLanguage = (language: string) => {
        if (socket && currentRoom) {
            socket.emit("language_change", {
                roomCode: currentRoom.id,
                language,
            });
        }
    };

    const leaveRoom = () => {
        setCurrentRoom(null);
        setCurrentUser(null);
        setMessages([]);
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                connected,
                currentRoom,
                currentUser,
                messages,
                createRoom,
                joinRoom,
                sendMessage,
                updateCode,
                updateCursor,
                changeLanguage,
                leaveRoom,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}
