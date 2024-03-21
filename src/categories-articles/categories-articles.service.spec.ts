import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesArticlesService } from './categories-articles.service';

describe('CategoriesArticlesService', () => {
  let service: CategoriesArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesArticlesService],
    }).compile();

    service = module.get<CategoriesArticlesService>(CategoriesArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
