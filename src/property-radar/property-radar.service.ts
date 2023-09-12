import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import {
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  reduce,
  retry,
  throwError,
} from 'rxjs';

@Injectable()
export class PropertyRadarService {
  constructor(private httpService: HttpService) {}

  // Prepare request payload for each contact
  prepareCriteria(contact: any) {
    return {
      Criteria: [
        { name: 'OwnerName', value: [contact.name] },
        { name: 'OwnerPhone', value: [contact.phone] },
        { name: 'OwnerEmail', value: [contact.email] },
        { name: 'Address', value: [contact.address1] },
        { name: 'City', value: [contact.city] },
        { name: 'State', value: [contact.state] },
        { name: 'ZipFive', value: [contact.postalCode] },
      ],
      Purchase: '0',
      Fields: 'Overview',
      Limit: '3', // match only the first three properties per CRM custom fields
      Sort: 'string',
      Start: '0',
    };
  }

  fetchPropertyDetailsForContact(contact: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PROPERTY_RADAR_API_TOKEN}`,
    };

    const body = this.prepareCriteria(contact);
    return this.httpService
      .post('https://api.propertyradar.com/v1/properties', body, { headers })
      .pipe(
        retry(3), // Retry up to 3 times on failure
        catchError((err) => {
          console.error(
            `Failed to fetch for contact ${contact.id}: ${err.message}`,
          );
          return throwError(() => err);
        }),
        map((response) => response.data),
      );
  }

  fetchPropertyDetails(contacts: any[]): Observable<any[]> {
    return from(contacts).pipe(
      mergeMap(
        (contact) => this.fetchPropertyDetailsForContact(contact),
        null,
        10,
      ), // 10 concurrent requests
      reduce((acc, one) => [...acc, one], [] as any[]), // Collect results into an array
    );
  }
}
