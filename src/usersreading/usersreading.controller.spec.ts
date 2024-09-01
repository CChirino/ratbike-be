import { Test, TestingModule } from '@nestjs/testing';
import { UsersreadingController } from './usersreading.controller';
import { UsersreadingService } from './usersreading.service';

describe('UsersreadingController', () => {
  let controller: UsersreadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersreadingController],
      providers: [UsersreadingService],
    }).compile();

    controller = module.get<UsersreadingController>(UsersreadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
