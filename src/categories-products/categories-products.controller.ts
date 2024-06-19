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
  UseGuards,
} from '@nestjs/common';
import { CreateCategoriesProductDto } from './dto/create-categories-product.dto';
import { UpdateCategoriesProductDto } from './dto/update-categories-product.dto';
import { CategoryProductService } from './categories-products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
@ApiTags('categories-products')
@Controller('categories-products')
@UseGuards(RolesGuard)
export class CategoriesProductsController {
  constructor(
    private readonly categoriesProductsService: CategoryProductService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('urlImageCategory'))
  @Roles('admin', 'moderador', 'user')
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
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  findAll() {
    return this.categoriesProductsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.categoriesProductsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
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
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.categoriesProductsService.remove(id);
  }
}
