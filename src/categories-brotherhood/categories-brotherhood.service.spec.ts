import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesBrotherhoodService } from './categories-brotherhood.service';

describe('CategoriesBrotherhoodService', () => {
  let service: CategoriesBrotherhoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesBrotherhoodService],
    }).compile();

    service = module.get<CategoriesBrotherhoodService>(CategoriesBrotherhoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
