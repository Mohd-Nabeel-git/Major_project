import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Card } from "../components/ui/card";
import { ModeToggle } from "../components/ui/mode-toggle";
import { useTheme } from "../components/ui/theme-provider";
import Notifications from "./Notifications";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../components/ui/dropdown-menu";
import { useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { toast } from "sonner";
import {
  addNotification,
  removeNotification,
} from "../slices/notificationsSlice";
import { fetchRequests } from "../slices/connectionsSlice";

export default function Navbar() {
  const token = useSelector((s) => s.auth.token);
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // 🔹 Notifications
  const notifications = useSelector((s) => s.notifications?.items || []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔹 Requests (Redux) → safe fallback to []
  const requests = useSelector((s) => s.connections?.requests || []);
  const requestCount = requests.length;

  // ✅ socket
  const socket = useSocket(auth.user?._id);

  // --- Initial fetch for pending requests ---
  useEffect(() => {
    if (token) {
      dispatch(fetchRequests());
    }
  }, [token, dispatch]);

  // --- Socket listeners ---
  useEffect(() => {
    if (!socket) return;

    socket.on("newRequest", () => {
      dispatch(fetchRequests());
      toast.success("You received a new connection request!");
    });

    socket.on("requestAccepted", () => {
      dispatch(fetchRequests());
      toast.info("A connection request was accepted 🤝");
    });

    socket.on("requestRemoved", () => {
      dispatch(fetchRequests());
    });

    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
      toast.success(notification.message || "New notification");
    });

    socket.on("notificationRemoved", (id) => {
      dispatch(removeNotification(id));
    });

    return () => {
      socket.off("newRequest");
      socket.off("requestAccepted");
      socket.off("requestRemoved");
      socket.off("newNotification");
      socket.off("notificationRemoved");
    };
  }, [socket, dispatch]);

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur bg-background/80 border-b border-border dark:bg-background/70">
      <Card className="w-full px-6 py-3 flex items-center justify-between rounded-none border-none shadow-none bg-background/80 dark:bg-background/70 text-foreground">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-extrabold text-2xl tracking-tight text-primary"
          >
            Global_Connect
          </Link>
          <Separator orientation="vertical" className="mx-2 h-8" />
          {token && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/">Feed</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/users">Users</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/jobs">Jobs</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/connections">Connections</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* 🔹 Requests button with badge */}
          {token && (
            <Button variant="ghost" asChild className="relative">
              <Link to="/requests">
                Requests
                {requestCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2"
                    variant="secondary"
                  >
                    {requestCount}
                  </Badge>
                )}
              </Link>
            </Button>
          )}

          {/* 🔹 Notifications dropdown with live badge */}
          {token && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  Notifications
                  {unreadCount > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2"
                      variant="secondary"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-0">
                <Notifications />
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ModeToggle />

          {!token ? (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Card>
    </nav>
  );
}
