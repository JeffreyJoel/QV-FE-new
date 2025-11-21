"use client";

import { CreateRoomForm } from "@/components/room/create-room";
import { JoinRoomDialog } from "@/components/room/join-room";
import { NavBar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQVFactory } from "@/hooks/useQVFactory";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { QVRoomABI } from "@/constants/abis/QVRoomABI";
import { type Address } from "viem";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Room {
  id: string;
  address: Address;
  name: string;
  description: string;
  creator: Address;
  active: boolean;
  participantCount: string;
  sessionCount: string;
  createdAt: string;
}

function Discover() {
  const publicClient = usePublicClient();
  const { allRooms, isLoadingAllRooms, errorAllRooms } = useQVFactory();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch room details when allRooms changes
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!publicClient || !allRooms || allRooms.length === 0) {
        setRooms([]);
        return;
      }

      setLoading(true);
      try {
        const roomDetails = await Promise.all(
          allRooms.map(async (roomAddress: Address, index: number) => {
            try {
              const roomInfo = await publicClient.readContract({
                address: roomAddress,
                abi: QVRoomABI,
                functionName: "getRoomInfo",
              }) as any;

              return {
                id: index.toString(),
                address: roomAddress,
                name: roomInfo[0],
                description: roomInfo[1],
                active: roomInfo[2],
                creator: roomInfo[3] as Address,
                createdAt: roomInfo[4]?.toString(),
                participantCount: roomInfo[5]?.toString(),
                sessionCount: roomInfo[6]?.toString(),
              };
            } catch (err) {
              console.error(`Failed to fetch room ${roomAddress}:`, err);
              return null;
            }
          })
        );

        setRooms(roomDetails.filter(Boolean) as Room[]);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [publicClient, allRooms]);

  return (
    <>
      <NavBar isApp={true} />
      <div>
        <div className="mx-auto md:max-w-7xl mt-16">
          <h1 className="text-center text-4xl font-bold text-[#00FF66]">
            Discover Rooms
          </h1>
          <p className="text-center text-gray-400 mt-6 text-xl">
            Empowering smarter decisions through the power of quadratic voting
          </p>

          <main className="container mx-auto px-4 py-8 mt-8">
            <div className="flex justify-end mb-4">
              <CreateRoomForm />
            </div>
            {isLoadingAllRooms || loading ? (
              <p className="text-center text-gray-400">Loading rooms...</p>
            ) : errorAllRooms ? (
              <p className="text-center text-red-500">Error: {errorAllRooms.message}</p>
            ) : rooms.length === 0 ? (
              <p className="text-center text-gray-400">No rooms found</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <Card key={room.address} className="backdrop-blur-sm bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <CardDescription>{room.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Address</span>
                          <span className="font-mono">
                            {room.address.slice(0, 6)}...
                            {room.address.slice(-4)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Admin</span>
                          <span className="font-mono">
                            {room.creator.slice(0, 6)}...
                            {room.creator.slice(-4)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Sessions
                          </span>
                          <span>{Number(room.sessionCount) || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              room.active
                                ? "bg-green-700 text-white"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {room.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <JoinRoomDialog
                          roomAddress={room.address}
                        />
                        <Link href={`/room/${room.address}`} className="flex-1">
                          <Button className="w-full" variant="secondary">
                            View Room
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Discover;
