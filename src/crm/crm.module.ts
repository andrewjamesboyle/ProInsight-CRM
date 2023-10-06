import { Module } from '@nestjs/common';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { HttpModule } from '@nestjs/axios';
import { OAuthModule } from 'src/oauth/oauth.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [HttpModule, OAuthModule, SupabaseModule],
  providers: [CrmService],
  controllers: [CrmController],
  exports: [CrmService],
})
export class CrmModule {}
