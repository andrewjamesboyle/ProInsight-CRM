import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { HttpModule } from '@nestjs/axios';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [HttpModule, SupabaseModule],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
