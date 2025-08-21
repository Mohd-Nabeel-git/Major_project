import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeed, createPost } from '../slices/postsSlice'
import { fetchNotifications } from '../slices/notificationsSlice'
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { likePost, commentPost, deletePost, getUserPosts } from '../utils/postActions';
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from '../components/ui/alert-dialog';

export default function Feed(){
  const dispatch = useDispatch()
  const user = useSelector(s=>s.auth.user)
  const posts = useSelector(s=>s.posts.items)
  const [showMine, setShowMine] = useState(false)
  const [myPosts, setMyPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')

  // For delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(()=>{ 
    if(user && user._id) {
      dispatch(fetchFeed(user._id))
    }
  },[user,dispatch])

  // Fetch my posts if filter is active
  useEffect(()=>{
    async function fetchMine() {
      if(showMine && user && user._id) {
        const { data } = await getUserPosts(user._id)
        setMyPosts(data)
      }
    }
    fetchMine()
  },[showMine, user])

  // Prevent rendering if not logged in
  if(!user || !user._id) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center text-lg text-muted-foreground">
        Please log in to view your feed.
      </div>
    )
  }

  const handlePost = async ()=>{
    if(content.trim()){
      await dispatch(createPost({ content }))
      await dispatch(fetchFeed(user._id)) // Always refetch for avatar/new post
      dispatch(fetchNotifications())
      toast.success('Post created!')
      setContent('')
      setOpen(false)
    } else {
      toast.error('Post cannot be empty.')
    }
  }

  // State for comment dialog
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [activePost, setActivePost] = useState(null)

  // Like handler
  const handleLike = async (postId) => {
    try {
      await likePost(postId)
      dispatch(fetchFeed(user._id))
      dispatch(fetchNotifications())
    } catch (e) {
      toast.error('Could not update like.')
    }
  }

  // Comment handler
  const handleComment = async () => {
    if (!commentText.trim() || !activePost) return toast.error('Comment cannot be empty.')
    try {
      await commentPost(activePost, commentText)
      setCommentText('')
      setCommentOpen(false)
      dispatch(fetchFeed(user._id))
      dispatch(fetchNotifications())
      toast.success('Comment added!')
    } catch (e) {
      toast.error('Could not add comment.')
    }
  }

  // Delete handler for AlertDialog
  const handleDelete = async () => {
    if(postToDelete) {
      try {
        await deletePost(postToDelete)
        if (showMine) {
          setMyPosts(prev => prev.filter(post => post._id !== postToDelete))
        }
        dispatch(fetchFeed(user._id))
        toast.success('Post deleted!')
      } catch (e) {
        toast.error('Could not delete post.')
      }
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      {/* Welcome Card for new users */}
      <Card className="mb-8 shadow-xl bg-gradient-to-br from-primary/10 to-background text-center border-2 border-primary">
        <CardHeader className="flex flex-col items-center justify-center gap-2 py-6">
          <CardTitle className="text-3xl font-extrabold text-primary">Welcome to Global Connect!</CardTitle>
          <p className="text-lg text-muted-foreground font-medium mt-2">Connecting Talent, Opportunity, and Community.</p>
          <span className="text-base text-foreground mt-1">Your professional journey starts here. Share, connect, and grow with a vibrant network.</span>
        </CardHeader>
      </Card>
      <Card className="mb-8 shadow-lg bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Your Feed</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={showMine ? "default" : "outline"}
              onClick={()=>setShowMine(!showMine)}
              disabled={posts.filter(p => p.userId?._id === user._id).length === 0}
            >
              {showMine ? "Show All" : "Show My Posts"}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Post</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md w-full bg-background text-foreground">
                <DialogHeader>
                  <DialogTitle>Create a Post</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={e=>setContent(e.target.value)}
                  className="mt-2 mb-4 bg-background text-foreground"
                  rows={4}
                />
                <DialogFooter>
                  <Button variant="default" onClick={handlePost}>Submit</Button>
                  <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>
      <div className="space-y-6">
        {(showMine ? myPosts : posts).length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-lg">
            No posts to display.
          </div>
        ) : (
          (showMine ? myPosts : posts).map(p=>(
            <Card key={p._id} className="shadow bg-card text-card-foreground">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.userId?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.userId?.name || 'User')}&background=random`}
                      alt={p.userId?.name || 'User'}
                      className="h-8 w-8 rounded-full border border-muted"
                    />
                    <span className="font-semibold text-primary">{p.userId?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</span>
                    {p.userId?._id === user._id && (
                      <AlertDialog open={deleteDialogOpen && postToDelete === p._id} onOpenChange={open => { setDeleteDialogOpen(open); if (!open) setPostToDelete(null); }}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setPostToDelete(p._id); setDeleteDialogOpen(true); }} 
                            className="ml-2 text-destructive" 
                            title="Delete Post"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          </AlertDialogHeader>
                          <div>Are you sure you want to delete this post? This action cannot be undone.</div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <Separator className="bg-border dark:bg-muted" />
              <CardContent>
                <div className="mt-1 text-base">{p.content}</div>
                <div className="flex gap-4 mt-4 items-center">
                  <Button variant="ghost" size="sm" onClick={()=>handleLike(p._id)} className="flex items-center gap-1">
                    <Heart className="h-4 w-4" fill={p.likes?.includes(user._id) ? "#ef4444" : "none"} stroke={p.likes?.includes(user._id) ? "#ef4444" : "currentColor"} />
                    <span>{p.likes?.length || 0}</span>
                  </Button>
                  <Dialog open={commentOpen && activePost === p._id} onOpenChange={open => { setCommentOpen(open); if (!open) setActivePost(null); }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={()=>{setActivePost(p._id); setCommentOpen(true);}} className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{p.comments?.length || 0}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-full bg-background text-foreground">
                      <DialogHeader>
                        <DialogTitle>Comments</DialogTitle>
                      </DialogHeader>
                      <div className="mb-4 max-h-60 overflow-y-auto pr-2">
                        {p.comments && p.comments.length > 0 ? (
                          <ul className="space-y-2">
                            {p.comments.map((c, idx) => (
                              <li key={idx} className="text-sm text-foreground">
                                <span className="font-semibold text-primary mr-2">
                                  {c.userName ? c.userName : (c.userId === user._id ? 'You' : 'User')}
                                </span>
                                {c.text}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-muted-foreground">No comments yet.</div>
                        )}
                      </div>
                      <Textarea
                        placeholder="Write your comment..."
                        value={commentText}
                        onChange={e=>setCommentText(e.target.value)}
                        className="mt-2 mb-4 bg-background text-foreground"
                        rows={3}
                      />
                      <DialogFooter>
                        <Button variant="default" onClick={handleComment}>Submit</Button>
                        <Button variant="outline" onClick={()=>setCommentOpen(false)}>Cancel</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}