import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Sema } from 'async-sema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PropertyRadarService {
  private sema: Sema;

  constructor(private httpService: HttpService) {
    this.sema = new Sema(10); // Allow 10 concurrent operations
  }

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

  async fetchPropertyDetailsForContact(contact: any): Promise<any> {
    // Acquire a semaphore before making an API request
    await this.sema.acquire();
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PROPERTY_RADAR_API_TOKEN}`,
      };

      const body = this.prepareCriteria(contact);
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.propertyradar.com/v1/properties',
          body,
          { headers },
        ),
      );

      return response.data;
    } catch (err) {
      console.error(
        `Failed to fetch for contact ${contact.id}: ${err.message}`,
      );
      throw err;
    } finally {
      // Release the semaphore
      this.sema.release();
    }
  }

  async fetchPropertyDetails(contacts: any[]): Promise<any[]> {
    const promises = contacts.map((contact) =>
      this.fetchPropertyDetailsForContact(contact),
    );
    return Promise.all(promises);
  }
}
