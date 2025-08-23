import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchNotifications,
  clearNotifications,
  markAsRead,
  addNotification,
  removeNotification,
} from "../slices/notificationsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useSocket } from "../hooks/useSocket"
import { toast } from "sonner"

export default function Notifications() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((s) => s.notifications)
  const auth = useSelector((s) => s.auth)
  const socket = useSocket(auth.user?._id)

  const unreadCount = items.filter((n) => !n.read).length

  // ✅ Fetch once on mount
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  // ✅ stable callbacks (no re-register)
  const handleNew = useCallback(
    (notification) => {
      dispatch(addNotification(notification))
      toast.success(notification.message || "New notification")
    },
    [dispatch]
  )

  const handleRemoved = useCallback(
    (id) => {
      dispatch(removeNotification(id))
    },
    [dispatch]
  )

  // ✅ attach socket listeners only once
  useEffect(() => {
    if (!socket) return

    socket.off("newNotification", handleNew)
    socket.off("notificationRemoved", handleRemoved)

    socket.on("newNotification", handleNew)
    socket.on("notificationRemoved", handleRemoved)

    return () => {
      socket.off("newNotification", handleNew)
      socket.off("notificationRemoved", handleRemoved)
    }
  }, [socket, handleNew, handleRemoved])

  return (
    <Card className="mb-6 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount}</Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(clearNotifications())}
        >
          Clear
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground">No notifications.</div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {items.map((n) => (
              <li
                key={n._id}
                onClick={() => !n.read && dispatch(markAsRead(n._id))}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  n.read
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {n.message}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
