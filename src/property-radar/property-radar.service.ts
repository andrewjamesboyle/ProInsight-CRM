import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Sema } from 'async-sema'; // Import the Sema class
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PropertyRadarService {
  private rateLimiter = new Sema(10, { capacity: 500 }); // Initialize the rate limiter

  constructor(private httpService: HttpService) {}

  async fetchPropertyDetails(contacts: any[]) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_API_TOKEN',
    };

    // Function to prepare request payload for each contact
    const prepareCriteria = (contact: any) => {
      return {
        Criteria: [
          { name: 'OwnerFirstName', value: [contact.firstName] },
          { name: 'OwnerLastName', value: [contact.lastName] },
          { name: 'Address', value: [contact.address] },
          { name: 'City', value: [contact.city] },
          { name: 'State', value: [contact.state] },
          { name: 'ZipFive', value: [contact.zipFive] },
        ],
        Purchase: '0',
        Fields: 'Overview',
        Limit: '3', // Limit set to 3 - match only the first three properties
        Sort: 'string',
        Start: '0',
      };
    };

    const results = [];

    for (const contact of contacts) {
      await this.rateLimiter.acquire(); // Acquire a permit from the rate limiter

      try {
        const body = prepareCriteria(contact);
        const response = await firstValueFrom(
          this.httpService.post(
            'https://api.propertyradar.com/v1/properties',
            body,
            { headers },
          ),
        );

        results.push(response.data);
      } catch (err) {
        console.error(
          `Failed to fetch property details for contact ${contact.id}: ${err.message}`,
        );
      } finally {
        this.rateLimiter.release(); // Release the permit back to the rate limiter
      }
    }

    return results;
  }
}
