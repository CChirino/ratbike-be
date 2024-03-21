import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesArticlesController } from './categories-articles.controller';
import { CategoriesArticlesService } from './categories-articles.service';

describe('CategoriesArticlesController', () => {
  let controller: CategoriesArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesArticlesController],
      providers: [CategoriesArticlesService],
    }).compile();

    controller = module.get<CategoriesArticlesController>(CategoriesArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
