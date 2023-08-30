import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class PropertyRadarService {
  constructor(private httpService: HttpService) {}

  fetchPropertyDetails(contacts: any[]) {
    // Logic to fetch property details for given contacts
    return this.httpService
      .post('PROPERTY_RADAR_API_ENDPOINT', { contacts })
      .pipe(map((response) => response.data));
  }
}
