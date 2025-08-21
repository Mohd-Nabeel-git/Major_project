import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginThunk } from '../slices/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const dispatch = useDispatch()
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    await dispatch(loginThunk({email,password}))
    nav('/')
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <form onSubmit={submit} className="space-y-4">
            <Input className="w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <Input className="w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <Button className="w-full" type="submit">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm w-full text-center">No account? <Link className="underline" to="/register">Register</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}