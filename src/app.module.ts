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
import { OAuthModule } from './oauth/oauth.module';
import { OAuthService } from './oauth/oauth.service';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    CrmModule,
    PropertyRadarModule,
    WebhookModule,
    HttpModule,
    OAuthModule,
    SupabaseModule,
  ],
  controllers: [AppController, OAuthController],
  providers: [
    AppService,
    WorkflowManagerService,
    SupabaseService,
    OAuthService,
  ],
})
export class AppModule {}
