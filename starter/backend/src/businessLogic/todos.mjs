import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

const todoAccess = new TodoAccess()

export async function getTodosPerUser(userId) {
    return await todoAccess.getTodosPerUser(userId)
  }

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()
  const createdAt = new Date().toISOString()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    createdAt,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

export async function updateTodo(todoId, updateTodoRequest, userId) {
  return await todoAccess.updateTodo(todoId, updateTodoRequest, userId)
}

export async function deleteTodo(todoId, userId) {
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function updateTodoUrl(attachmentUrl, userId, todoId) {
  return await todoAccess.updateTodoUrl(userId, todoId, attachmentUrl)
}

export async function generateUploadUrl(todoId) {
  return await getUploadUrl(todoId)
}