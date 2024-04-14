import { Test, TestingModule } from '@nestjs/testing';
import { WallController } from './wall.controller';
import { WallService } from './wall.service';

describe('WallController', () => {
  let controller: WallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WallController],
      providers: [WallService],
    }).compile();

    controller = module.get<WallController>(WallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
