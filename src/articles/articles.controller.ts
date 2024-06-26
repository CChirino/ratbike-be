import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('articles')
@Controller('articles')
@UseGuards(RolesGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createArticleDto: CreateArticleDto,
    @Res() response,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.articlesService.create(createArticleDto, files, response, user);
  }

  @Get()
  @Roles('public', 'admin', 'moderador', 'user')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
  ) {
    return this.articlesService.findAll(page, limit, category);
  }

  @Get('most-read')
  @Roles('admin', 'moderador', 'user')
  @UseGuards(AuthGuard('jwt'))
  async getMostReadArticles() {
    const mostReadArticles = await this.articlesService.getMostReadArticles();
    return mostReadArticles;
  }

  @Get('latest')
  @Roles('admin', 'moderador', 'user')
  @UseGuards(AuthGuard('jwt'))
  async getLatestArticles() {
    const latestArticles = await this.articlesService.getLatestArticles();
    return latestArticles;
  }

  @Get(':id')
  @Roles('public', 'admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Res() response,
  ) {
    return this.articlesService.update(id, updateArticleDto, response);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @Get(':category')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  async getArticlesByCategory(@Param('category') category: string) {
    const articles =
      await this.articlesService.findArticlesByCategory(category);
    return articles;
  }
}
