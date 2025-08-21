import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { loadChat } from '../slices/chatSlice'
import { fetchNotifications } from '../slices/notificationsSlice'
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useSocket } from '../hooks/useSocket'

export default function Chat() {
  const { peerId } = useParams()
  const dispatch = useDispatch()
  const auth = useSelector(s => s.auth)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socket = useSocket(auth.user?._id)

  const messagesEndRef = useRef(null)

  // Load old chat history
  useEffect(() => {
    if (peerId && auth.user) {
      dispatch(loadChat({ sender: auth.user._id, receiver: peerId })).then(res => {
        if (res.payload) setMessages(res.payload)
      })
    }
  }, [peerId, auth.user, dispatch])

  // Listen for incoming socket messages
  useEffect(() => {
    if (!socket) return
    socket.on("newMessage", msg => {
      if (
        (msg.senderId._id === auth.user._id && msg.receiverId._id === peerId) ||
        (msg.senderId._id === peerId && msg.receiverId._id === auth.user._id)
      ) {
        setMessages(prev => [...prev, msg])
      }
    })
    return () => socket.off("newMessage")
  }, [socket, auth.user, peerId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (text.trim() && auth.user && peerId) {
      socket.emit("sendMessage", {
        senderId: auth.user._id,
        receiverId: peerId,
        content: text
      })
      dispatch(fetchNotifications())
      setText('')
    } else {
      toast.error('Message cannot be empty.')
    }
  }

  if (!auth.user || !auth.user._id)
    return <div className="text-center py-10">Login to chat.</div>

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-lg bg-card text-card-foreground flex flex-col h-[500px]">
        <CardHeader>
          <CardTitle className="text-xl">Chat</CardTitle>
        </CardHeader>
        <Separator className="bg-border dark:bg-muted" />

        {/* Messages */}
        <CardContent className="flex-1 overflow-auto space-y-2 mt-4 px-2">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-center">No messages yet.</div>
          ) : (
            messages.map(m => {
              const isMe = m.senderId._id === auth.user._id
              return (
                <div
                  key={m._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs font-semibold mb-1 text-muted-foreground">
                        {m.senderId.name || "Peer"}
                      </div>
                    )}
                    <div>{m.content}</div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input bar */}
        <CardFooter className="flex gap-2 items-center border-t pt-2">
          <Textarea
            placeholder="Type your message..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={1}
            className="flex-1 resize-none max-h-28 overflow-y-auto bg-background text-foreground"
          />
          <Button variant="default" onClick={handleSend}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
