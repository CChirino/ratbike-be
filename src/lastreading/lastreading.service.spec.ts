import { Test, TestingModule } from '@nestjs/testing';
import { LastreadingService } from './lastreading.service';

describe('LastreadingService', () => {
  let service: LastreadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastreadingService],
    }).compile();

    service = module.get<LastreadingService>(LastreadingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
