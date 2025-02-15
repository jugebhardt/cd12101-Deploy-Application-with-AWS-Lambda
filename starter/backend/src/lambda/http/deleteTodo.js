import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo  } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('delete')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing incoming event', { event })
    const todoId = event.pathParameters.todoId

    const userId = getUserId(event)
    logger.info('Deleting todo', { todoId, userId })
    await deleteTodo(todoId, userId)

    return {
      statusCode: 204
    }
  })

