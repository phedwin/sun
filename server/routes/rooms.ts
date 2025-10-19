import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Generate random 6-character room code
function generateRoomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Get all public rooms
router.get("/", async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            where: { isPublic: true },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                members: {
                    where: { isOnline: true },
                    select: {
                        id: true,
                        userId: true,
                        isOnline: true,
                        color: true,
                    },
                },
                _count: {
                    select: {
                        members: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const roomsWithStats = rooms.map((room) => ({
            id: room.id,
            name: room.name,
            description: room.description,
            code: room.code,
            creatorName: room.creator.name || "Anonymous",
            currentProblem: room.currentProblem,
            totalMembers: room._count.members,
            onlineMembers: room.members.length,
            createdAt: room.createdAt,
        }));

        res.json(roomsWithStats);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
});

// Get room by code
router.get("/:code", async (req, res) => {
    try {
        const { code } = req.params;

        const room = await prisma.room.findUnique({
            where: { code },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 50,
                },
            },
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json(room);
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ error: "Failed to fetch room" });
    }
});

// Create a new room
router.post("/create", async (req, res) => {
    try {
        const {
            name,
            description,
            username,
            isPublic = true,
            maxMembers = 10,
        } = req.body;

        if (!name || !username) {
            return res
                .status(400)
                .json({ error: "Name and username are required" });
        }

        // Generate unique room code
        let code = generateRoomCode();
        let existingRoom = await prisma.room.findUnique({ where: { code } });

        while (existingRoom) {
            code = generateRoomCode();
            existingRoom = await prisma.room.findUnique({ where: { code } });
        }

        // Create or find user
        let user = await prisma.user.findFirst({
            where: { name: username },
        });

        if (!user) {
            // Create temporary user
            user = await prisma.user.create({
                data: {
                    email: `${username.toLowerCase().replace(/\s+/g, "")}@temp.com`,
                    name: username,
                    provider: "temp",
                    providerId: `temp_${Date.now()}_${Math.random()}`,
                },
            });
        }

        // Create room
        const room = await prisma.room.create({
            data: {
                name,
                description,
                code,
                creatorId: user.id,
                isPublic,
                maxMembers,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        // Add creator as first member
        const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#FFA07A",
            "#98D8C8",
            "#F7DC6F",
            "#BB8FCE",
            "#85C1E2",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        await prisma.roomMember.create({
            data: {
                roomId: room.id,
                userId: user.id,
                role: "owner",
                isOnline: true,
                color: randomColor,
            },
        });

        res.json({
            room,
            user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Failed to create room" });
    }
});

// Join a room
router.post("/join", async (req, res) => {
    try {
        const { code, username } = req.body;

        if (!code || !username) {
            return res
                .status(400)
                .json({ error: "Room code and username are required" });
        }

        // Find room
        const room = await prisma.room.findUnique({
            where: { code },
            include: {
                _count: {
                    select: { members: true },
                },
            },
        });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Check if room is full
        if (room._count.members >= room.maxMembers) {
            return res.status(400).json({ error: "Room is full" });
        }

        // Create or find user
        let user = await prisma.user.findFirst({
            where: { name: username },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: `${username.toLowerCase().replace(/\s+/g, "")}@temp.com`,
                    name: username,
                    provider: "temp",
                    providerId: `temp_${Date.now()}_${Math.random()}`,
                },
            });
        }

        // Check if already a member
        const existingMember = await prisma.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: room.id,
                    userId: user.id,
                },
            },
        });

        if (existingMember) {
            // Update to online
            await prisma.roomMember.update({
                where: { id: existingMember.id },
                data: { isOnline: true, lastSeenAt: new Date() },
            });
        } else {
            // Add as new member
            const colors = [
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#FFA07A",
                "#98D8C8",
                "#F7DC6F",
                "#BB8FCE",
                "#85C1E2",
            ];
            const randomColor =
                colors[Math.floor(Math.random() * colors.length)];

            await prisma.roomMember.create({
                data: {
                    roomId: room.id,
                    userId: user.id,
                    role: "member",
                    isOnline: true,
                    color: randomColor,
                },
            });
        }

        res.json({
            room,
            user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ error: "Failed to join room" });
    }
});

export default router;
