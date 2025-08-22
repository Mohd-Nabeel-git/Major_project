import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { toast } from "sonner";
import { fetchNotifications } from "../slices/notificationsSlice";

export default function Profile() {
  const { id } = useParams();
  const auth = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const userId = id || auth.user?._id;
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [backupProfile, setBackupProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      api.get(`/api/users/${userId}`).then((res) => {
        setProfile(res.data);
        setBackupProfile(res.data);
      });
    }
  }, [userId]);

  const save = async () => {
    await api.put(`/api/users/${userId}`, profile);
    dispatch(fetchNotifications());
    toast.success("Profile saved!");
    setBackupProfile(profile);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setProfile(backupProfile); // restore original
    setIsEditing(false);
  };

  if (!userId)
    return <div className="text-center py-10">Login to view profile.</div>;
  if (!profile)
    return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card className="overflow-hidden shadow-xl border border-primary/30 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Profile Header */}
        <CardHeader className="flex flex-col items-center gap-3 py-10 px-6 text-center">
          <Avatar className="h-24 w-24 border-4 border-primary shadow-md transition-transform hover:scale-105">
            <AvatarImage
              src={
                profile.avatarUrl ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(profile.name || "User") +
                  "&background=random"
              }
            />
            <AvatarFallback className="text-xl">
              {profile.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            {profile.name || "Unnamed User"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </CardHeader>

        <Separator className="bg-border" />

        {/* Editable Fields */}
        <CardContent className="mt-6 space-y-6">
          {/* Name */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Name
            </h3>
            {isEditing ? (
              <Input
                className="w-full bg-background text-foreground"
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Your Name"
              />
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {profile.name || "Unnamed User"}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Bio
            </h3>
            {isEditing ? (
              <Textarea
                className="w-full bg-background text-foreground min-h-[100px]"
                placeholder="Write something about yourself..."
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            ) : (
              <div className="p-3 rounded-md border border-border bg-accent/30 text-sm text-foreground">
                {profile.bio || "No bio set yet"}
              </div>
            )}
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <Button onClick={save}>Save Changes</Button>
              <Button onClick={cancelEdit} variant="outline">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="secondary">
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
