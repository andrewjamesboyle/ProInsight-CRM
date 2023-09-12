import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, map, of } from 'rxjs';
import { ContactCreateDto } from 'src/contact-create.dto';

@Injectable()
export class CrmService {
  constructor(private httpService: HttpService) {}

  extractContactDetails(contact: ContactCreateDto): Observable<any> {
    // Logic to receive contact details from CRM webhook
    const {
      name,
      phone,
      email,
      address1,
      city,
      state,
      postalCode,
      locationId,
    } = contact;
    return of({
      name,
      phone,
      email,
      address1,
      city,
      state,
      postalCode,
      locationId,
    });
  }

  updateContacts(apiToken: string, updatedData: any) {
    // Logic to update contacts with property details
    return this.httpService
      .post(
        'https://services.leadconnectorhq.com/contacts/upsert',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            Version: '2021-07-28',
          },
        },
      )
      .pipe(map((response) => response.data));
  }
}
