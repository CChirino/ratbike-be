import { Test, TestingModule } from '@nestjs/testing';
import { BrotherhoodController } from './brotherhood.controller';
import { BrotherhoodService } from './brotherhood.service';

describe('BrotherhoodController', () => {
  let controller: BrotherhoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrotherhoodController],
      providers: [BrotherhoodService],
    }).compile();

    controller = module.get<BrotherhoodController>(BrotherhoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
