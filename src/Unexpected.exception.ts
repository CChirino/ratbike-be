import { HttpException, HttpStatus } from "@nestjs/common";

export class UnexpectedException extends HttpException {
    constructor(error: any) {
      super('UNEXPECTED_SITUATION', HttpStatus.INTERNAL_SERVER_ERROR, {cause: error});
    }
  }