import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesProductsService } from './categories-products.service';

describe('CategoriesProductsService', () => {
  let service: CategoriesProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesProductsService],
    }).compile();

    service = module.get<CategoriesProductsService>(CategoriesProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
