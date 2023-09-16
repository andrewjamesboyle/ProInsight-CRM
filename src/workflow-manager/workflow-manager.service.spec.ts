import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowManagerService } from './workflow-manager.service';

describe('WorkflowManagerService', () => {
  let service: WorkflowManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowManagerService],
    }).compile();

    service = module.get<WorkflowManagerService>(WorkflowManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
