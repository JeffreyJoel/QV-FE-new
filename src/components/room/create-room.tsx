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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useQVFactory } from "@/hooks/useQVFactory"

export function CreateRoomForm() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { createRoom, isCreatingRoom, isConfirming } = useQVFactory()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const hash = await createRoom(
        formData.get("name") as string,
        formData.get("description") as string,
      )
      
      if (hash) {
        toast({
          title: "Success",
          description: "Room created successfully! Transaction hash: " + hash.slice(0, 10) + "...",
        })
        setOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room: " + (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>Create a new voting room for participants</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input id="name" name="name" placeholder="Enter room name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the purpose of this room" required />
          </div>
          <Button type="submit" className="w-full" disabled={isCreatingRoom || isConfirming}>
            {isCreatingRoom || isConfirming ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}