import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listJobs, createJob, applyJob, deleteJob } from '../slices/jobsSlice'
import { fetchNotifications } from '../slices/notificationsSlice'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { toast } from 'sonner'
import { X, UserPlus } from "lucide-react"

export default function Jobs(){
  const dispatch = useDispatch()
  const { items } = useSelector(s=>s.jobs)
  const { user } = useSelector(s=>s.auth)

  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [skills,setSkills]=useState('')
  
  // Application modal state
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyMsg, setApplyMsg] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(()=>{ dispatch(listJobs()) },[dispatch])

  const add = async ()=>{
    if(!title) return toast.error("Job title required")
    const payload = {
      title,
      description,
      skills: skills.split(',').map(s=>s.trim()).filter(Boolean)
    }
    await dispatch(createJob(payload))
    setTitle(''); setDescription(''); setSkills('')
    toast.success("Job posted!")
  }

  const openApply = (job)=>{
    setSelectedJob(job)
    setApplyOpen(true)
  }

  const submitApplication = async ()=>{
    if(!applyMsg) return toast.error("Please write a short message")
    await dispatch(applyJob({ jobId: selectedJob._id, message: applyMsg }))
    dispatch(fetchNotifications())
    toast.success("Application submitted!")
    setApplyMsg('')
    setApplyOpen(false)
  }

  const remove = async (id)=>{
    await dispatch(deleteJob(id))
    toast.success("Job deleted")
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      {/* Job Posting Form */}
      <Card className="shadow-xl bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">🚀 Post a Job</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 mt-4">
          <Input placeholder="Job title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <Input placeholder="Skills (comma separated)" value={skills} onChange={e=>setSkills(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button onClick={add} className="w-full">Create Job</Button>
        </CardFooter>
      </Card>

      {/* Job List */}
      <div className="space-y-6">
        {items.length === 0 && (
          <p className="text-center text-muted-foreground">No jobs posted yet.</p>
        )}
        {items.map(j=>(
          <Card key={j._id} className="shadow-md bg-card text-card-foreground hover:shadow-lg transition">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-semibold text-lg">{j.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Posted {new Date(j.createdAt).toLocaleDateString()} by {j.postedBy?.name || "Someone"}
                </p>
              </div>
              {user?._id === j.postedBy?._id && (
                <Button variant="ghost" size="icon" onClick={()=>remove(j._id)}>
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3">
              <div className="text-sm text-foreground">{j.description}</div>
              {j.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {j.skills.map((s,idx)=>(
                    <span key={idx} className="px-2 py-1 text-xs bg-muted rounded-full">{s}</span>
                  ))}
                </div>
              )}
              {j.applicants?.length > 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                  {j.applicants.length} applicant{j.applicants.length>1 ? "s":""} so far
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={()=>openApply(j)} variant="secondary" className="w-full flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Apply
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Apply Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <Textarea 
            placeholder="Write a short application message..."
            value={applyMsg}
            onChange={e=>setApplyMsg(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={()=>setApplyOpen(false)}>Cancel</Button>
            <Button onClick={submitApplication}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
