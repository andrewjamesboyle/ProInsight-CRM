import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Thank you for installing the Database Diagnostic Tool. Please navigate back to your CRM.';
  }
}
