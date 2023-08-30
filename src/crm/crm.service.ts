import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class CrmService {
  constructor(private httpService: HttpService) {}

  fetchContacts(apiToken: string) {
    // Logic to fetch contacts from CRM API
    return this.httpService
      .get('CRM_API_ENDPOINT_TO_FETCH_CONTACTS', {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
      .pipe(map((response) => response.data));
  }

  updateContacts(apiToken: string, updatedData: any) {
    // Logic to update contacts with property details
    return this.httpService
      .post('CRM_API_ENDPOINT_TO_UPDATE_CONTACTS', updatedData, {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
      .pipe(map((response) => response.data));
  }
}
