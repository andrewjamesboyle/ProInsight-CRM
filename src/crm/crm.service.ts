import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, of } from 'rxjs';
import { ContactCreateDto } from 'src/contact-create.dto';

@Injectable()
export class CrmService {
  constructor(private httpService: HttpService) {}

  extractContactDetails(contact: ContactCreateDto): Observable<any> {
    // Receive contact details from CRM webhook
    const { name, phone, email, address1, locationId } = contact;
    return of({ name, phone, email, address1, locationId });
  }

  // TO DO: Send contact details to PropertyRadar API

  // fetchContacts(apiToken: string) {
  //   // Logic to fetch contacts from CRM API

  //   return this.httpService
  //     .get('CRM_API_ENDPOINT_TO_FETCH_CONTACTS', {
  //       headers: { Authorization: `Bearer ${apiToken}` },
  //     })
  //     .pipe(map((response) => response.data));
  // }

  updateContacts(apiToken: string, updatedData: any) {
    // Logic to update contacts with property details
    return this.httpService
      .post('CRM_API_ENDPOINT_TO_UPDATE_CONTACTS', updatedData, {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
      .pipe(map((response) => response.data));
  }
}