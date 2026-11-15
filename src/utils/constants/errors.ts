import { HttpStatus } from '@nestjs/common'

export const errorCodes = {
  sheetAlreadyConfirmed: 'SHEET_ALREADY_CONFIRMED',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  defaultError: 'DEFAULT_ERROR',
}

export const httpStatuses: Record<number, string> = {
  [HttpStatus.UNAUTHORIZED]: errorCodes.unauthorized,
  [HttpStatus.FORBIDDEN]: errorCodes.forbidden,
  [HttpStatus.NOT_FOUND]: errorCodes.notFound,
  [HttpStatus.INTERNAL_SERVER_ERROR]: errorCodes.internalServerError,
}
