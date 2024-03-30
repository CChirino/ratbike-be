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

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
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
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get(':category')
  async getProductsByCategory(@Param('category') category: string) {
    const products =
      await this.productsService.findProductsByCategory(category);
    return products;
  }
}
