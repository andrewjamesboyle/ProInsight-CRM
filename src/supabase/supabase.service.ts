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
}
