import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrmModule } from './crm/crm.module';
import { PropertyRadarModule } from './property-radar/property-radar.module';
import { WebhookModule } from './webhook/webhook.module';
import { OAuthController } from './oauth/oauth.controller';
import { WorkflowManagerService } from './workflow-manager/workflow-manager.service';
import { SupabaseService } from './supabase/supabase.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CrmModule, PropertyRadarModule, WebhookModule, HttpModule],
  controllers: [AppController, OAuthController],
  providers: [AppService, WorkflowManagerService, SupabaseService],
})
export class AppModule {}
