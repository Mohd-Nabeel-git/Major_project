export async function getUserPosts(userId) {
  return api.get(`/api/posts/user/${userId}`)
}
export async function deletePost(id) {
  return api.delete(`/api/posts/${id}`)
}
import api from '../utils/api'

export async function likePost(id) {
  return api.post(`/api/post-actions/${id}/like`)
}

export async function commentPost(id, text) {
  return api.post(`/api/post-actions/${id}/comment`, { text })
}
