// controllers/connectionController.js
import Connection from "../models/Connection.js"
import Notification from "../models/Notification.js"

export async function sendRequest(req, res) {
  try {
    const { userId } = req.params
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't connect with yourself" })
    }

    const existing = await Connection.findOne({
      requester: req.user._id,
      recipient: userId
    })
    if (existing) return res.status(400).json({ message: "Request already exists" })

    const conn = await Connection.create({ requester: req.user._id, recipient: userId })
    
    // notify recipient
    await Notification.create({
      user: userId,
      type: "connection",
      message: `${req.user.name} sent you a connection request`,
      link: `/connections`
    })

    res.status(201).json(conn)
  } catch (err) {
    console.error("❌ sendRequest error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export async function respondRequest(req, res) {
  try {
    const { requestId } = req.params
    const { action } = req.body // "accept" or "reject"

    const conn = await Connection.findById(requestId)
    if (!conn) return res.status(404).json({ message: "Request not found" })
    if (conn.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your request" })
    }

    conn.status = action === "accept" ? "accepted" : "rejected"
    await conn.save()

    res.json(conn)
  } catch (err) {
    console.error("❌ respondRequest error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export async function listConnections(req, res) {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.user._id, status: "accepted" },
        { recipient: req.user._id, status: "accepted" }
      ]
    }).populate("requester recipient", "name profilePic email")

    res.json(connections)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export async function listPending(req, res) {
  try {
    const requests = await Connection.find({
      recipient: req.user._id,
      status: "pending"
    }).populate("requester", "name profilePic email")

    res.json(requests)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
