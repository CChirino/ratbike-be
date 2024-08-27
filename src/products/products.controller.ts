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
  Req,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Roles('admin', 'moderador')
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response,
    @Body() createProductDto: CreateProductDto,
    @Req() request: Request,
  ) {
    const user = request.user;
    return await this.productsService.create(
      createProductDto,
      files,
      user,
      response,
    );
  }

  @Get()
  @Roles('public', 'admin', 'moderador', 'user')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll(page, limit, category);
  }

  @Get(':id')
  @Roles('public', 'admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Roles('admin', 'moderador')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
    @Res() response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const user = request.user;
    return this.productsService.update(
      id,
      updateProductDto,
      user,
      response,
      files,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string, @Res() response) {
    return this.productsService.remove(id, response);
  }

  @Get(':category')
  @Roles('admin', 'moderador')
  async getProductsByCategory(@Param('category') category: string) {
    const products =
      await this.productsService.findProductsByCategory(category);
    return products;
  }
}
