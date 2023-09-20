import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

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
        // { name: 'City', value: [contact.city] },
        // { name: 'State', value: [contact.state] },
        // { name: 'ZipFive', value: [contact.postalCode] },
      ],
      Purchase: '1',
      Fields: 'Overview',
      Limit: '3', // match the first three properties per CRM custom fields
      Sort: '',
      Start: '0',
    };
  }

  async fetchPropertyDetailsForContact(contact: any): Promise<any> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PROPERTY_RADAR_API_TOKEN}`,
      };

      const body = this.prepareCriteria(contact);

      // Extract out the parameters that should go into the URL
      const urlParams = {
        Purchase: body.Purchase,
        Fields: body.Fields,
        Limit: body.Limit,
        Sort: body.Sort,
        Start: body.Start,
      };

      console.log('Fetching property details for contact: ', body);
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.propertyradar.com/v1/properties',
          { Criteria: body.Criteria },
          { headers, params: urlParams },
        ),
      );
      console.log('Property Radar Response Data: ', response.data);
      return response.data;
    } catch (err) {
      console.error(
        `Failed to fetch for contact ${contact.name}: ${err.message}`,
      );
      console.error('Error details:', err); // Log the full error details
      throw err;
    }
  }

  async fetchPropertyDetails(contact: any): Promise<any> {
    return this.fetchPropertyDetailsForContact(contact);
  }
}
