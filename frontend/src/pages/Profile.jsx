import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { useParams } from 'react-router-dom'
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from '../slices/notificationsSlice';

export default function Profile(){
  const { id } = useParams()
  const auth = useSelector(s=>s.auth)
  const [profile,setProfile] = useState(null)
  const userId = id || (auth.user?._id)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(userId){
      api.get(`/api/users/${userId}`).then(res=>setProfile(res.data))
    }
  },[userId])

  const save = async ()=>{
    await api.put(`/api/users/${userId}`, profile)
    dispatch(fetchNotifications())
    toast.success('Profile saved!')
  }

  if(!userId) return <div className="text-center py-10">Login to view profile.</div>;
  if(!profile) return <div className="text-center py-10">Loading...</div>;
  return (
    <div className="max-w-2xl mx-auto py-10">
  <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={profile.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || "User") + "&background=random"} />
            <AvatarFallback>{profile.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl mb-1">{profile.name || "Unnamed User"}</CardTitle>
          <p className="text-muted-foreground">{profile.email}</p>
        </CardHeader>
        <Separator className="bg-border dark:bg-muted" />
        <CardContent className="mt-4 space-y-3">
          <Input className="w-full bg-background text-foreground" value={profile.name||''} onChange={e=>setProfile({...profile, name:e.target.value})} placeholder="Name" />
          <Textarea className="w-full bg-background text-foreground" placeholder="Bio" value={profile.bio||''} onChange={e=>setProfile({...profile, bio:e.target.value})} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={save} variant="default">Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}