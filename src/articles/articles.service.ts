import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schema/article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { PaginationResponse } from './interfaces/pagination.interface';
import { LastReadingService } from 'src/lastreading/lastreading.service';
import { UsersreadingService } from 'src/usersreading/usersreading.service';
import { UserService } from 'src/user/user.service';
import { Types } from 'mongoose';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private lastReadingService: LastReadingService,
    private userReadingService: UsersreadingService,
    private usersService: UserService,
  ) {}
  async create(
    createArticleDto: CreateArticleDto,
    files: Express.Multer.File[],
    response,
    user: any,
  ): Promise<Article> {
    try {
      let translation = null;

      if (createArticleDto.translation) {
        const parsedTranslation = JSON.parse(createArticleDto.translation);

        translation = {
          translationTitle: parsedTranslation.translationTitle,
          translationSubtitle: parsedTranslation.translationSubtitle,
          translationDescription: parsedTranslation.translationDescription,
        };
      }
      const newArticle = new this.articleModel({
        ...createArticleDto,
        ...(translation && { translation }),
        createdBy: user.name + ' ' + user.lastname,
      });

      if (files && files.length > 0) {
        const urlImageArticle = files[0].path.replace(/\\/g, '/');
        newArticle.urlImageArticle = urlImageArticle;
      } else {
        const defaultImagePath = 'uploads/articles/default-article-image.jpg';
        if (fs.existsSync(defaultImagePath)) {
          newArticle.urlImageArticle = defaultImagePath;
        }
      }

      if (files && files.length > 1) {
        const galleryImagesArticles = files
          .slice(1)
          .map((file) => file.path.replace(/\\/g, '/'));
        newArticle.galleryImagesArticles = galleryImagesArticles;
      }

      const createdArticle = await newArticle.save();

      const responseObj = {
        status: HttpStatus.OK,
        data: createdArticle,
      };

      let lastReading = await this.lastReadingService.findOne();

      if (!lastReading) {
        // Crear un nuevo registro si no existe
        lastReading = await this.lastReadingService.create({
          news: new Date(),
          brotherhood: null,
          events: null,
          store: null,
          wall: null,
        });
      } else {
        // Actualizar el campo 'news' si el registro ya existe
        await this.lastReadingService.updateNews(lastReading._id.toString(), {
          news: new Date(),
        });
      }

      return response.status(HttpStatus.CREATED).json(responseObj);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      throw error;
    }
  }

  async findAll(
    user: any,
    page?: number,
    limit?: number,
    category?: string,
  ): Promise<{ status: number; data: PaginationResponse<Article> }> {
    try {
      page = page && parseInt(page.toString(), 10);
      limit = limit && parseInt(limit.toString(), 10);

      if (page && (isNaN(page) || page < 1)) {
        throw new HttpException(
          'El parámetro "page" debe ser un número entero positivo.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (limit && (isNaN(limit) || limit < 1)) {
        throw new HttpException(
          'El parámetro "limit" debe ser un número entero positivo.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const defaultLimit = 20; // Límite predeterminado si no se proporciona el parámetro limit
      const actualLimit = limit || defaultLimit; // Determinar el límite actual a utilizar
      const andQueryArray: any = [];

      if (!!category) {
        andQueryArray.push({ category: category });
      }

      let query = this.articleModel.find({
        ...(andQueryArray.length && { $and: andQueryArray }),
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const total = await this.articleModel.countDocuments({
        ...(andQueryArray.length && { $and: andQueryArray }),
        $or: [{ delete_at: null }, { delete_date: null }],
      });

      const totalPages = Math.ceil(total / actualLimit);

      if (totalPages === 0) {
        throw new HttpException(
          'No se encontraron resultados.',
          HttpStatus.NOT_FOUND,
        );
      }

      if (page && (page < 1 || page > totalPages)) {
        throw new HttpException(
          'Página fuera de rango.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (page) {
        const skipCount = (page - 1) * actualLimit;
        query = query.skip(skipCount).limit(actualLimit);
      } else {
        query = query.limit(actualLimit);
      }

      const data = await query.exec();

      // Verificar si existe un registro en LastReading
      let lastReading = await this.lastReadingService.findOne();

      if (!lastReading) {
        // Crear un nuevo registro si no existe
        lastReading = await this.lastReadingService.create({
          news: new Date(),
          brotherhood: null,
          events: null,
          store: null,
          wall: null,
        });
      } else {
        // Actualizar el campo 'news' si el registro ya existe
        await this.lastReadingService.updateNews(lastReading._id.toString(), {
          news: new Date(),
        });
      }

      await this.handleUserReading(user);

      const response: {
        status: number;
        data: PaginationResponse<Article>;
      } = {
        status: HttpStatus.OK,
        data: {
          paginationData: {
            page: page || 1,
            limit: actualLimit,
            total,
            totalPages,
          },
          data,
        },
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<{ status: number; article: Article }> {
    try {
      const article = await this.articleModel.findById(id).exec();
      await this.incrementViews(id);
      return {
        status: HttpStatus.OK,
        article: article,
      };
    } catch (error) {
      // Manejo del error
      const errorMessage = error.message || 'Error interno del servidor';
      const errorResponse = {
        error: errorMessage,
      };
      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    files: Express.Multer.File[],
  ): Promise<Article> {
    try {
      let translation = null;
      if (updateArticleDto.translation) {
        const parsedTranslation = JSON.parse(updateArticleDto.translation);

        translation = {
          translationTitle: parsedTranslation.translationTitle,
          translationSubtitle: parsedTranslation.translationSubtitle,
          translationDescription: parsedTranslation.translationDescription,
        };
      }

      const updateData: any = {
        ...updateArticleDto,
        ...(translation && { translation }),
        update_at: new Date(),
      };

      const existingArticle = await this.articleModel.findById(id).exec();
      if (!existingArticle) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }

      if (files && files.length > 0) {
        const urlImageArticle = files[0].path.replace(/\\/g, '/');
        updateData.urlImageArticle = urlImageArticle;
        updateData.galleryImagesArticles = [
          ...(updateArticleDto.filesToKeep.length
            ? updateArticleDto.filesToKeep.split(',')
            : []),
        ];
        if (files.length > 1) {
          const galleryImagesArticles = files.map((file) =>
            file.path.replace(/\\/g, '/'),
          );
          updateData.galleryImagesWall = [
            ...galleryImagesArticles,
            ...(updateArticleDto.filesToKeep.length
              ? updateArticleDto.filesToKeep.split(',')
              : []),
          ];
        }
      } else {
        updateData.galleryImagesArticles = [
          ...(updateArticleDto.filesToKeep.length
            ? updateArticleDto.filesToKeep.split(',')
            : []),
        ];
      }

      const updatedArticle = await this.articleModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedArticle) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }

      return updatedArticle; // Solo devuelves el artículo actualizado
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, response): Promise<Article> {
    try {
      const article = await this.articleModel.findById(id).exec();

      if (!article) {
        // Si el producto no se encuentra, devolver una respuesta 404
        return response.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        });
      }

      if (article) {
        article.delete_at = new Date().toISOString();
        article.delete_date = new Date();
        await article.save();
      }
      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Product marked for deletion',
        data: article,
      });
    } catch (error) {
      throw error;
    }
  }

  async findArticlesByCategory(category: string): Promise<Article[]> {
    const article = await this.articleModel.find({ category }).exec();
    return article;
  }

  async getMostReadArticles(): Promise<Article[]> {
    try {
      const mostReadArticles = await this.articleModel
        .find()
        .sort({ views: -1 }) // Ordenar por views en orden descendente
        .limit(10) // Obtener los 10 artículos más leídos
        .exec();

      return mostReadArticles;
    } catch (error) {
      throw error;
    }
  }

  async getLatestArticles(): Promise<Article[]> {
    try {
      const latestArticles = await this.articleModel
        .find()
        .sort({ createdAt: -1 }) // Ordenar por createdAt en orden descendente
        .limit(10) // Obtener los 10 artículos más recientes
        .exec();

      return latestArticles;
    } catch (error) {
      throw error;
    }
  }

  async incrementViews(articleId: string): Promise<Article> {
    try {
      const article = await this.articleModel.findById(articleId);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      article.views += 1;
      return article.save();
    } catch (error) {
      throw error;
    }
  }

  private async handleUserReading(user: any): Promise<void> {
    try {
      // Buscar el ID del usuario por su correo electrónico
      const userId = await this.usersService.findUserIdByEmail(user.email);

      if (!userId) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      // Buscar el registro de lectura del usuario
      let usersReading = await this.userReadingService.findOneByUserId(userId);

      // Datos a utilizar para la creación o actualización
      const updateData = {
        news: new Date(),
      };

      if (!usersReading) {
        // Crear un nuevo registro si no existe
        usersReading = await this.userReadingService.create({
          userId,
          ...updateData,
          brotherhood: null,
          events: null,
          store: null,
          wall: null,
        });
      } else {
        // Verifica que el registro exista antes de actualizar
        if (!usersReading._id) {
          throw new HttpException(
            'Registro de lectura del usuario no válido.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        // Actualizar el campo 'news' si el registro ya existe
        await this.userReadingService.updateReadingUsers(
          usersReading._id.toString(), // Verifica que `_id` esté presente en el documento.
          updateData,
        );
      }
    } catch (error) {
      // Manejar errores
      console.error(
        'Error al manejar el registro de lectura del usuario:',
        error,
      );
      throw error;
    }
  }
}
