import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"

export default function Connections() {
  const [connections, setConnections] = useState([])
  const auth = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data } = await api.get("/api/connections")
        // Flatten connections: pick the "other" user from requester/recipient
        const mapped = data.map(conn => {
          const otherUser =
            conn.requester._id === auth.user._id
              ? conn.recipient
              : conn.requester
          return otherUser
        })
        setConnections(mapped)
      } catch (err) {
        console.error("Error fetching connections:", err)
      }
    }
    if (auth.user) fetchConnections()
  }, [auth.user])

  if (!auth.user) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Login to see your connections.
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">My Connections</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="divide-y">
          {connections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No connections yet. Accept requests to start chatting.
            </div>
          ) : (
            connections.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-4 py-4 px-3 rounded-lg hover:bg-muted/50 transition-all duration-300"
              >
                {/* Left: Avatar + Name */}
                <div className="flex items-center gap-4">
                  <Avatar className="ring-2 ring-transparent hover:ring-primary transition-all duration-300">
                    <AvatarImage src={user.profilePic || ""} alt={user.name} />
                    <AvatarFallback className="uppercase bg-primary/20 text-primary font-bold">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">{user.name}</p>
                    {user.email && (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </div>

                {/* Right: Chat button */}
                <Button
                  size="sm"
                  variant="default"
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all"
                  onClick={() => navigate(`/chat/${user._id}`)}
                >
                  Chat
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
