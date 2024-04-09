import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsNotEmpty()
  title: string;
  subtitle: string;
  description: string;
  category: string;
  @IsOptional()
  urlImageArticle: string;
  galleryImagesArticles: string;
  @IsOptional()
  @IsObject()
  translationTitle: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationSubtitle: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationDescription: Record<string, any>;
}
