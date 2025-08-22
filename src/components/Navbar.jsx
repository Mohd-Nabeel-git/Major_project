import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Card } from "../components/ui/card";
import { ModeToggle } from "../components/ui/mode-toggle";
import { useTheme } from "../components/ui/theme-provider";
import Notifications from "./Notifications";
import { useSelector as useReduxSelector } from "react-redux";
import { Badge } from "../components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../components/ui/dropdown-menu";



export default function Navbar() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Get unread notification count for badge
  const notifications = useReduxSelector(s => s.notifications.items);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur bg-background/80 border-b border-border dark:bg-background/70">
      <Card className="w-full px-6 py-3 flex items-center justify-between rounded-none border-none shadow-none bg-background/80 dark:bg-background/70 text-foreground">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-extrabold text-2xl tracking-tight text-primary">Global_Connect</Link>
          <Separator orientation="vertical" className="mx-2 h-8" />
          {token && <Button variant="ghost" asChild><Link to="/">Feed</Link></Button>}
          {token && <Button variant="ghost" asChild><Link to="/users">Users</Link></Button>}
          {token && <Button variant="ghost" asChild><Link to="/jobs">Jobs</Link></Button>}
          {token && <Button variant="ghost" asChild><Link to="/chat">Chat</Link></Button>}
          {token && <Button variant="ghost" asChild><Link to="/profile">Profile</Link></Button>}
        </div>
        <div className="flex items-center gap-4">
          {token && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  Notifications
                  {unreadCount > 0 && <Badge className="absolute -top-2 -right-2" variant="secondary">{unreadCount}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-0">
                <Notifications />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
          {!token ? (
            <Button asChild><Link to="/login">Login</Link></Button>
          ) : (
            <Button variant="outline" onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</Button>
          )}
        </div>
      </Card>
    </nav>
  );
}