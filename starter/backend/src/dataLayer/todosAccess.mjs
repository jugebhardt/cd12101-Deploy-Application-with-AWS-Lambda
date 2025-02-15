import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('data')

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient, {
      marshallOptions: {
        removeUndefinedValues: true
      }
    })
  }
  
  async getTodosPerUser(userId) {
    try {
      const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      }
      })
      return result.Items
    } catch (e) {
      logger.error('Failed to get todos', { error: e.message })
    }
  }

  async createTodo(todo) {

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(todoId, updateTodoRequest, userId) {
    
    await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      ExpressionAttributeNames: { "#N": "name" },
      UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues: {
        ":todoName": updateTodoRequest.name,
        ":dueDate": updateTodoRequest.dueDate,
        ":done": updateTodoRequest.done
      }
    })
  }

  async updateTodoUrl(userId, todoId, attachmentUrl) {

    await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: "set attachmentUrl=:attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl
      }
    })
  }
  
  async deleteTodo(todoId, userId) {

    await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Key: { userId, todoId }
    })
  }
}