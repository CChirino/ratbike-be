import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesArticleDto } from './create-categories-article.dto';

export class UpdateCategoriesArticleDto extends PartialType(CreateCategoriesArticleDto) {}
