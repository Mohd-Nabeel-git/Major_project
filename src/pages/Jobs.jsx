import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listJobs, createJob } from '../slices/jobsSlice'
import { fetchNotifications } from '../slices/notificationsSlice'
import api from '../utils/api'
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from 'sonner';

export default function Jobs(){
  const dispatch = useDispatch()
  const { items } = useSelector(s=>s.jobs)
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')

  useEffect(()=>{ dispatch(listJobs()) },[dispatch])

  const add = async ()=>{
    if(title) await dispatch(createJob({title, description, skills: []}))
    setTitle(''); setDescription('')
  }

  const apply = async (id)=>{
    await api.post(`/api/jobs/apply/${id}`)
    dispatch(fetchNotifications())
    toast.success('Applied for job!')
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
  <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Post a Job</CardTitle>
        </CardHeader>
        <Separator className="bg-border dark:bg-muted" />
        <CardContent className="space-y-3 mt-4">
          <Input placeholder="Job title" value={title} onChange={e=>setTitle(e.target.value)} className="bg-background text-foreground" />
          <Textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="bg-background text-foreground" />
        </CardContent>
        <CardFooter>
          <Button onClick={add} className="w-full" variant="default">Create</Button>
        </CardFooter>
      </Card>
      <div className="space-y-6">
        {items.map(j=>(
          <Card key={j._id} className="shadow bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="font-semibold">{j.title}</CardTitle>
            </CardHeader>
            <Separator className="bg-border dark:bg-muted" />
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">{j.description}</div>
            </CardContent>
            <CardFooter>
              <Button onClick={()=>apply(j._id)} variant="secondary" className="w-full">Apply</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}