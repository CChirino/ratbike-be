import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schema/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import fs from 'fs-extra';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}
  async create(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
    response,
  ): Promise<Article> {
    try {
      const newArticle = new this.articleModel(createArticleDto);

      if (file) {
        const urlImageArticle = file.path.replace(/\\/g, '/');
        newArticle.urlImageArticle = urlImageArticle;
      } else {
        const defaultImagePath = 'uploads/products/default-product-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          createArticleDto.urlImageArticle = defaultImagePath;
        }
      }

      const createdArticle = await newArticle.save();

      response.status(HttpStatus.CREATED).json(createdArticle);
      return createdArticle;
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      throw error;
    }
  }

  async findAll(): Promise<Article[]> {
    try {
      return this.articleModel
        .find({
          $or: [{ delete_at: null }, { delete_date: null }],
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Article> {
    try {
      return this.articleModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    try {
      return this.articleModel
        .findByIdAndUpdate(id, updateArticleDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Article> {
    try {
      const article = await this.articleModel.findById(id).exec();

      if (article) {
        article.delete_at = new Date().toISOString();
        article.delete_date = new Date();
        await article.save();
      }

      return article;
    } catch (error) {
      throw error;
    }
  }
}
