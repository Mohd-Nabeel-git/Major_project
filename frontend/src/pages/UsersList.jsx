import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"

export default function UsersList() {
  const [users, setUsers] = useState([])
  const auth = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/users")
        // exclude logged in user
        setUsers(data.filter(u => u._id !== auth.user?._id))
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    if (auth.user) fetchUsers()
  }, [auth.user])

  if (!auth.user) {
    return <div className="text-center py-10">Login to see users.</div>
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Users</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="divide-y">
          {users.length === 0 ? (
            <div className="text-muted-foreground text-center py-6">No other users found.</div>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                onClick={() => navigate(`/chat/${user._id}`)}
                className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted rounded-lg px-2 transition"
              >
                <Avatar>
                  <AvatarImage src={user.profilePic || ""} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
