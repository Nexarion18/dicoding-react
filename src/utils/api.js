const BASE_URL = 'https://forum-api.dicoding.dev/v1'
const TOKEN_KEY = 'dicoding_forum_access_token'

const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

const putAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

const request = async (endpoint, { method = 'GET', body, headers = {} } = {}, { auth = true } = {}) => {
  const config = {
    method,
    headers: {
      ...headers
    }
  }

  if (typeof body !== 'undefined' && method !== 'GET' && method !== 'HEAD') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body)
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
  }

  const token = getAccessToken()
  if (auth && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.status !== 'success') {
    const message = payload.message || 'Terjadi kesalahan pada permintaan.'
    throw new Error(message)
  }

  return payload.data
}

export const registerUser = async ({ name, email, password }) => {
  const data = await request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }, { auth: false })
  return data.user
}

export const loginUser = async ({ email, password }) => {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }, { auth: false })
  putAccessToken(data.token)
  return data.token
}

export const getUsers = async () => {
  const data = await request('/users', { method: 'GET' }, { auth: false })
  return data.users
}

export const getOwnProfile = async () => {
  const data = await request('/users/me')
  return data.user
}

export const createThread = async ({ title, body, category }) => {
  const data = await request('/threads', {
    method: 'POST',
    body: JSON.stringify({ title, body, category })
  })
  return data.thread
}

export const getThreads = async () => {
  const data = await request('/threads', { method: 'GET' }, { auth: false })
  return data.threads
}

export const getThreadDetail = async (threadId) => {
  const data = await request(`/threads/${threadId}`, { method: 'GET' }, { auth: false })
  return data.detailThread
}

export const createComment = async ({ threadId, content }) => {
  const data = await request(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content })
  })
  return data.comment
}

export const upVoteThread = async (threadId) => {
  await request(`/threads/${threadId}/up-vote`, { method: 'POST' })
  return { threadId, voteType: 1 }
}

export const downVoteThread = async (threadId) => {
  await request(`/threads/${threadId}/down-vote`, { method: 'POST' })
  return { threadId, voteType: -1 }
}

export const neutralVoteThread = async (threadId) => {
  await request(`/threads/${threadId}/neutral-vote`, { method: 'POST' })
  return { threadId, voteType: 0 }
}

export const upVoteComment = async ({ threadId, commentId }) => {
  await request(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST' })
  return { threadId, commentId, voteType: 1 }
}

export const downVoteComment = async ({ threadId, commentId }) => {
  await request(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST' })
  return { threadId, commentId, voteType: -1 }
}

export const neutralVoteComment = async ({ threadId, commentId }) => {
  await request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST' })
  return { threadId, commentId, voteType: 0 }
}

export const getLeaderboards = async () => {
  const data = await request('/leaderboards', { method: 'GET' }, { auth: false })
  return data.leaderboards
}

export const tokenStorage = {
  getAccessToken,
  putAccessToken,
  clearAccessToken
}
