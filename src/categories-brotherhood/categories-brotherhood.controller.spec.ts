import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesBrotherhoodController } from './categories-brotherhood.controller';
import { CategoriesBrotherhoodService } from './categories-brotherhood.service';

describe('CategoriesBrotherhoodController', () => {
  let controller: CategoriesBrotherhoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesBrotherhoodController],
      providers: [CategoriesBrotherhoodService],
    }).compile();

    controller = module.get<CategoriesBrotherhoodController>(CategoriesBrotherhoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
