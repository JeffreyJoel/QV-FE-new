"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import toast from "react-hot-toast"
import { useQVRoom } from "@/hooks/useQVRoom"
import { type Address } from "viem"

interface JoinRoomDialogProps {
  roomAddress: Address
}

export function JoinRoomDialog({ roomAddress }: JoinRoomDialogProps) {
  const [open, setOpen] = useState(false)
  const { joinRoom, isWriting, isConfirming } = useQVRoom({ roomAddress })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const hash = await joinRoom()
      if (hash) {
        toast.success("Successfully joined the room!");
        setOpen(false)
      }
    } catch (error) {
      toast.error("Failed to join room: " + (error as Error).message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Room</DialogTitle>
          <DialogDescription>
            Connect your wallet and join this room to participate in voting sessions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isWriting || isConfirming}
          >
            {isWriting || isConfirming ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

