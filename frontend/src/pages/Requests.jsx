import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import api from "../utils/api"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"

export default function PendingRequests() {
  const [requests, setRequests] = useState([])
  const auth = useSelector(s => s.auth)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await api.get("/api/connections/pending")
        setRequests(data)
      } catch (err) {
        console.error("Error fetching pending requests:", err)
      }
    }
    if (auth.user) fetchPending()
  }, [auth.user])

  const respond = async (requestId, action) => {
    try {
      await api.post(`/api/connections/respond/${requestId}`, { action })
      setRequests(prev => prev.filter(r => r._id !== requestId))
    } catch (err) {
      console.error("Error responding to request:", err)
    }
  }

  if (!auth.user) {
    return <div className="text-center py-10 text-muted-foreground">Login to see requests.</div>
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Connection Requests</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="divide-y">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending requests.
            </div>
          ) : (
            requests.map(req => (
              <div
                key={req._id}
                className="flex items-center justify-between gap-4 py-4 px-3 rounded-lg hover:bg-muted/50 transition-all duration-300"
              >
                {/* Left: Avatar + Name */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={req.requester.profilePic || ""} alt={req.requester.name} />
                    <AvatarFallback>{req.requester.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">{req.requester.name}</p>
                    {req.requester.email && (
                      <p className="text-sm text-muted-foreground">{req.requester.email}</p>
                    )}
                  </div>
                </div>

                {/* Right: Accept / Reject buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => respond(req._id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => respond(req._id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
