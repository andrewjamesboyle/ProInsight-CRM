import { Module } from '@nestjs/common';
import { PropertyRadarService } from './property-radar.service';
import { PropertyRadarController } from './property-radar.controller';

@Module({
  providers: [PropertyRadarService],
  controllers: [PropertyRadarController]
})
export class PropertyRadarModule {}
