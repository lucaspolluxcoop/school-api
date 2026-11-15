import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { errorCodes, httpStatuses } from '../constants/errors'

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Custom Exception')

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number = 500
    let code: string = errorCodes.internalServerError

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      code = exception.errorCode
        ? exception.errorCode
        : (httpStatuses[exception.getStatus()] ??
          errorCodes.internalServerError)
    } else if (exception instanceof Error) {
      this.logger.error(`Error: ${exception.message}`, exception.stack)
    }

    response.status(status).json({
      statusCode: status,
      code,
      path: request.url,
    })
  }
}
