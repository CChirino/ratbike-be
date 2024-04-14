import { Test, TestingModule } from '@nestjs/testing';
import { WallService } from './wall.service';

describe('WallService', () => {
  let service: WallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WallService],
    }).compile();

    service = module.get<WallService>(WallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
