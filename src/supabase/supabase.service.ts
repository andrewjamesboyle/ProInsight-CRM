import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );
  }

  getSupabase() {
    return this.supabase;
  }

  // Method for adding a new record
  async addRecord(tableName: string, data: any) {
    const { data: inserted, error } = await this.supabase
      .from(tableName)
      .insert([data]);

    if (error) {
      throw new Error(error.message);
    }
    return inserted;
  }

  // Method for fetching records
  async fetchRecords(tableName: string) {
    const { data: records, error } = await this.supabase
      .from(tableName)
      .select('*');

    if (error) {
      throw new Error(error.message);
    }
    return records;
  }

  // Method for updating an existing record based on location_id
  async updateRecord(tableName: string, data: any, locationId: string) {
    const { data: updated, error } = await this.supabase
      .from(tableName)
      .update(data)
      .eq('location_id', locationId);

    if (error) {
      throw new Error(error.message);
    }
    return updated;
  }

  async isTokenExpired(locationId: string): Promise<boolean> {
    const { data: records, error } = await this.supabase
      .from('your_table_name')
      .select('access_token_expiration')
      .eq('locationId', locationId);

    if (error) {
      throw new Error(error.message);
    }

    if (!records || records.length === 0) {
      return true; // Assume it's expired if no record exists
    }

    const expirationTime = new Date(
      records[0].access_token_expiration,
    ).getTime();
    const currentTime = new Date().getTime();

    return currentTime >= expirationTime;
  }

  //method for fetching refresh tokens
  async fetchRefreshToken(locationId: string): Promise<string> {
    const { data: records, error } = await this.supabase
      .from('oauth_tokens')
      .select('refresh_token')
      .eq('location_id', locationId);

    if (error) {
      throw new Error(error.message);
    }

    if (!records || records.length === 0) {
      throw new Error('No records found');
    }

    return records[0].refresh_token;
  }

  async fetchCurrentToken(locationId: string): Promise<string> {
    const { data: records, error } = await this.supabase
      .from('oauth_tokens')
      .select('access_token')
      .eq('location_id', locationId);

    if (error) {
      throw new Error(error.message);
    }

    if (!records || records.length === 0) {
      throw new Error('No records found for the given locationId');
    }

    return records[0].access_token;
  }
}
