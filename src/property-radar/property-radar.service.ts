import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class PropertyRadarService {
  constructor(private httpService: HttpService) {}

  fetchPropertyDetails(contacts: any[]) {
    // Build criteria based on contacts
    const criteria = contacts.map((contact) => {
      return {
        name: 'OwnerFirstName', // field names from PropertyRadar
        value: [contact.firstName],
      };
    });

    // Request body
    const body = {
      Criteria: criteria,
      Purchase: '0',
      Fields: 'Overview',
      Limit: '500', // Set a limit, you might want to adjust this
      Sort: 'string',
      Start: '0',
    };

    // API Headers
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_API_TOKEN', // Replace with your actual API token
    };

    return this.httpService
      .post('https://api.propertyradar.com/v1/properties', body, { headers })
      .pipe(map((response) => response.data));
  }
}
