import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateArticleDto {
  [x: string]: any;
  @IsOptional()
  createdAt: Date;
  @IsOptional()
  title: string;
  @IsOptional()
  subtitle: string;
  @IsOptional()
  description: string;
  @IsOptional()
  category: string;
  @IsOptional()
  link: string;
  @IsOptional()
  author: string;
  @IsOptional()
  urlImageArticle: string;
  @IsOptional()
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
