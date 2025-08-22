import Post from '../models/Post.js'
import Notification from '../models/Notification.js'

export async function createPost(req, res) {
  try {
    const { content } = req.body

    const post = await Post.create({
      userId: req.user._id,
      content: content || '',
      image: req.file ? `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}` : null,
      media: Array.isArray(req.body.media) ? req.body.media : []
    })

    await Notification.create({
      user: req.user._id,
      type: 'post',
      message: 'Your post was created successfully.',
      link: `/profile/${req.user._id}`
    })

    res.json(post)
  } catch (err) {
    console.error("❌ Error creating post:", err)
    res.status(500).json({ message: "Server error" })
  }
}


export async function getUserPosts(req, res) {
  const userId = req.params.userId
  let posts = await Post.find({ userId })
    .sort({ createdAt: -1 })
    .populate('userId', 'name profilePic email')

  posts = await Promise.all(posts.map(async post => {
    if (post.comments && post.comments.length > 0) {
      const populatedComments = await Promise.all(post.comments.map(async c => {
        const user = await Post.db.model('User').findById(c.userId).select('name')
        return { ...c.toObject(), userName: user ? user.name : 'User' }
      }))
      post = post.toObject()
      post.comments = populatedComments
    }
    return post
  }))
  res.json(posts)
}

export async function deletePost(req, res) {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  if (post.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
  await post.deleteOne()
  res.json({ ok: true })
}

export async function getFeed(req, res) {
  let posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('userId', 'name profilePic email')

  posts = await Promise.all(posts.map(async post => {
    if (post.comments && post.comments.length > 0) {
      const populatedComments = await Promise.all(post.comments.map(async c => {
        const user = await Post.db.model('User').findById(c.userId).select('name')
        return { ...c.toObject(), userName: user ? user.name : 'User' }
      }))
      post = post.toObject()
      post.comments = populatedComments
    }
    return post
  }))
  res.json(posts)
}

export async function likePost(req, res) {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  const userId = req.user._id
  let liked = false

  if (!post.likes.includes(userId)) {
    post.likes.push(userId)
    liked = true
    if (post.userId.toString() !== userId) {
      await Notification.create({
        user: post.userId,
        type: 'post',
        message: 'Someone liked your post.',
        link: `/profile/${post.userId}`
      })
    }
  } else {
    post.likes = post.likes.filter(id => id.toString() !== userId.toString())
    liked = false
  }
  await post.save()
  res.json({ ok: true, likes: post.likes.length, liked })
}

export async function commentPost(req, res) {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  const userId = req.user._id
  const { text } = req.body
  if (text && text.trim()) {
    post.comments.push({ userId, text })
    await post.save()
    if (post.userId.toString() !== userId) {
      await Notification.create({
        user: post.userId,
        type: 'post',
        message: 'Someone commented on your post.',
        link: `/profile/${post.userId}`
      })
    }
    const populatedComments = await Promise.all(post.comments.map(async c => {
      const user = await Post.db.model('User').findById(c.userId).select('name')
      return { ...c.toObject(), userName: user ? user.name : 'User' }
    }))
    res.json({ ok: true, comments: populatedComments })
  } else {
    res.status(400).json({ message: 'Comment cannot be empty.' })
  }
}
