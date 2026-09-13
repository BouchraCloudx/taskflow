import { API_URL } from './config';
 
async function request(method, token, body) {
  const res = await fetch(`${API_URL}/tasks`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
 
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Erreur ${res.status}`);
  }
 
  return res.json();
}
 
export function listTasks(token, userId) {
  return fetch(`${API_URL}/tasks?userId=${encodeURIComponent(userId)}`, {
    headers: { Authorization: token },
  }).then((res) => res.json());
}
 
export function createTask(token, userId, title) {
  return request('POST', token, { userId, title });
}
 
export function updateTaskStatus(token, userId, taskId, status) {
  return request('PUT', token, { userId, taskId, status });
}
 
export function deleteTask(token, userId, taskId) {
  return request('DELETE', token, { userId, taskId });
}
 