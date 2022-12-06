import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException as HttpNotFoundException,
  BadRequestException as HttpBadRequestException,
  ConflictException as HttpConflictException,
  ForbiddenException as HttpForbiddenException,
  InternalServerErrorException as HttpInternalServerErrorException,
  UnauthorizedException as HttpUnauthorizedException,
  UnprocessableEntityException as HttpUnprocessableEntityException,
} from '@nestjs/common';

import {
  Exception,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '../exceptions';

@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    let httpException: HttpException;

    switch (exception.constructor) {
      case BadRequestException:
        httpException = new HttpBadRequestException(exception.message);
        break;
      case UnauthorizedException:
        httpException = new HttpUnauthorizedException(exception.message);
        break;
      case ForbiddenException:
        httpException = new HttpForbiddenException(exception.message);
        break;
      case NotFoundException:
        httpException = new HttpNotFoundException(exception.message);
        break;
      case ConflictException:
        httpException = new HttpConflictException(exception.message);
        break;
      case UnprocessableEntityException:
        httpException = new HttpUnprocessableEntityException(exception.message);
        break;
      case InternalServerErrorException:
        httpException = new HttpInternalServerErrorException(exception.message);
        break;
      default:
        httpException = new HttpInternalServerErrorException(exception.message);
        break;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = httpException.getStatus();
    const message = httpException.message;
    const error = httpException.name;

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
