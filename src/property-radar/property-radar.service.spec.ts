import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRadarService } from './property-radar.service';

describe('PropertyRadarService', () => {
  let service: PropertyRadarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyRadarService],
    }).compile();

    service = module.get<PropertyRadarService>(PropertyRadarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
