import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;
  subtitle: string;
  description: string;
  category: string;
  @IsOptional()
  urlImageArticle: string;
  static urlImageArticle: string;
}
