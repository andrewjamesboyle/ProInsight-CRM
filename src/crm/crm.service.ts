import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ContactCreateDto } from 'src/contact-create.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CrmService {
  constructor(private httpService: HttpService) {}

  async extractContactDetails(contact: ContactCreateDto): Promise<any> {
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

    return Promise.resolve({
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

  async updateContacts(updatedData: any): Promise<any> {
    try {
      const response$ = this.httpService.post(
        'https://services.leadconnectorhq.com/contacts/upsert',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PROPERTY_RADAR_API_TOKEN}`,
            Version: '2021-07-28',
          },
        },
      );

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      // TO DO: Handle errors here, or just re-throw
      throw error;
    }
  }
}
