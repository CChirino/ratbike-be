import { Test, TestingModule } from '@nestjs/testing';
import { UsersreadingService } from './usersreading.service';

describe('UsersreadingService', () => {
  let service: UsersreadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersreadingService],
    }).compile();

    service = module.get<UsersreadingService>(UsersreadingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
