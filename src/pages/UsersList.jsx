import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"

export default function UsersList() {
  const [users, setUsers] = useState([])
  const auth = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/users")
        setUsers(data.filter(u => u._id !== auth.user?._id))
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    if (auth.user) fetchUsers()
  }, [auth.user])

  if (!auth.user) {
    return <div className="text-center py-10 text-muted-foreground">Login to see users.</div>
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
            <div className="text-center py-8 text-muted-foreground">
              No other users found.
            </div>
          ) : (
            users.map(user => (
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
                    {/* Optional: user email or status */}
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
