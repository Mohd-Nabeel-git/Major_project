// routes/connections.js
import { Router } from "express"
import auth from "../middleware/auth.js"
import { sendRequest, respondRequest, listConnections, listPending } from "../controllers/connectionController.js"

const r = Router()
r.post("/request/:userId", auth, sendRequest)
r.post("/respond/:requestId", auth, respondRequest)
r.get("/", auth, listConnections)
r.get("/pending", auth, listPending)

export default r
