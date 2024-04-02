import { Test, TestingModule } from '@nestjs/testing';
import { BrotherhoodService } from './brotherhood.service';

describe('BrotherhoodService', () => {
  let service: BrotherhoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrotherhoodService],
    }).compile();

    service = module.get<BrotherhoodService>(BrotherhoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
