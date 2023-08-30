import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRadarController } from './property-radar.controller';

describe('PropertyRadarController', () => {
  let controller: PropertyRadarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyRadarController],
    }).compile();

    controller = module.get<PropertyRadarController>(PropertyRadarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
