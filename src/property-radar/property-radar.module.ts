import { Module } from '@nestjs/common';
import { PropertyRadarService } from './property-radar.service';
import { PropertyRadarController } from './property-radar.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PropertyRadarService],
  controllers: [PropertyRadarController],
  exports: [PropertyRadarService],
})
export class PropertyRadarModule {}
