import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchRequests, sendRequest } from "../slices/connectionsSlice"
import api from "../utils/api"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"
import { toast } from "sonner"
import { useSocket } from "../hooks/useSocket"

export default function UsersList() {
  const [users, setUsers] = useState([])
  const { user } = useSelector((s) => s.auth)
  const { requests } = useSelector((s) => s.connections)
  const dispatch = useDispatch()

  const socket = useSocket(user?._id)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/users")
        setUsers(data.filter((u) => u._id !== user?._id))
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    if (user) fetchUsers()
  }, [user])

  // ✅ Fetch pending requests on mount
  useEffect(() => {
    if (user) dispatch(fetchRequests())
  }, [dispatch, user])

  useEffect(() => {
    if (!socket) return
    socket.on("connectionAccepted", ({ from }) => {
      toast.success(`${from.name} is now connected with you 🎉`)
    })
    return () => {
      socket.off("connectionAccepted")
    }
  }, [socket])

  const handleSendRequest = async (userId) => {
    try {
      await dispatch(sendRequest(userId)).unwrap()
      toast.success("Connection request sent 📩")
    } catch (err) {
      console.error("Error sending request:", err)
      toast.error("Failed to send request")
    }
  }

  // ✅ helper to check if user already requested
  const isPending = (userId) => requests.some((r) => r.requester?._id === userId || r.recipient?._id === userId)

  if (!user) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Login to see users.
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Users</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="divide-y">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No other users found.</div>
          ) : (
            users.map((u) => (
              <div key={u._id} className="flex items-center justify-between gap-4 py-4 px-3 rounded-lg hover:bg-muted/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={u.profilePic || ""} alt={u.name} />
                    <AvatarFallback>{u.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">{u.name}</p>
                    {u.email && <p className="text-sm text-muted-foreground">{u.email}</p>}
                  </div>
                </div>

                {isPending(u._id) ? (
                  <span className="text-sm text-muted-foreground italic">Request Sent</span>
                ) : (
                  <Button size="sm" onClick={() => handleSendRequest(u._id)}>
                    Connect
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
