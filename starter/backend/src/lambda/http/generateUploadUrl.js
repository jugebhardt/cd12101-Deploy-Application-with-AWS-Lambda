import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { generateUploadUrl  } from '../../businessLogic/todos.mjs'
import { updateTodoUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('url')

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

    const uploadUrl = await generateUploadUrl(todoId)
    logger.info('Generated upload url', { uploadUrl })
    await updateTodoUrl(uploadUrl.split("?")[0], userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })

