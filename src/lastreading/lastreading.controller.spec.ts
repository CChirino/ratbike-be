import { Test, TestingModule } from '@nestjs/testing';
import { LastreadingController } from './lastreading.controller';
import { LastreadingService } from './lastreading.service';

describe('LastreadingController', () => {
  let controller: LastreadingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LastreadingController],
      providers: [LastreadingService],
    }).compile();

    controller = module.get<LastreadingController>(LastreadingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
