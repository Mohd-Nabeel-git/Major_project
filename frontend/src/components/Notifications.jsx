import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, clearNotifications } from '../slices/notificationsSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function Notifications() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.notifications);
  const unreadCount = items.filter(n => !n.read).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <Card className="mb-6 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount}</Badge>}
        </div>
        <Button variant="outline" size="sm" onClick={() => dispatch(clearNotifications())}>Clear</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground">No notifications.</div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {items.map((n, i) => (
              <li key={i} className={`p-2 rounded ${n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                {n.message}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
