import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateArticleDto {
  [x: string]: any;
  @IsNotEmpty()
  createdAt: Date;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  link: string;
  autor: string;
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
