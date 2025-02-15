import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { getTodosPerUser } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('get')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing incoming event', { event })
  
    const userId = getUserId(event)
    logger.info('Getting todos', { userId })
    const todos = await getTodosPerUser(userId)
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  })
