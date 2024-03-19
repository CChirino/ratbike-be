import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { CreateCategoriesProductDto } from './dto/create-categories-product.dto';
import { UpdateCategoriesProductDto } from './dto/update-categories-product.dto';
import { CategoryProductService } from './categories-products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories-products')
@Controller('categories-products')
export class CategoriesProductsController {
  constructor(
    private readonly categoriesProductsService: CategoryProductService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('urlImageCategory'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoriesProductDto: CreateCategoriesProductDto,
    @Res() response,
  ) {
    return this.categoriesProductsService.create(
      createCategoriesProductDto,
      file,
      response,
    );
  }

  @Get()
  findAll() {
    return this.categoriesProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesProductsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriesProductDto: UpdateCategoriesProductDto,
  ) {
    return this.categoriesProductsService.update(
      id,
      updateCategoriesProductDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesProductsService.remove(id);
  }
}
