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
import { BrotherhoodService } from './brotherhood.service';
import { CreateBrotherhoodDto } from './dto/create-brotherhood.dto';
import { UpdateBrotherhoodDto } from './dto/update-brotherhood.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('brotherhood')
@Controller('brotherhood')
@UseGuards(RolesGuard)
export class BrotherhoodController {
  constructor(private readonly brotherhoodService: BrotherhoodService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Roles('admin', 'moderador', 'user')
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response,
    @Req() request: Request,
    @Body() createBrotherhoodDto: CreateBrotherhoodDto,
  ) {
    const user = request.user;
    return this.brotherhoodService.create(
      createBrotherhoodDto,
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
    return this.brotherhoodService.findAll(page, limit, category);
  }

  @Get(':id')
  @Roles('public', 'admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.brotherhoodService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  update(
    @Param('id') id: string,
    @Body() updateBrotherhoodDto: UpdateBrotherhoodDto,
    @Req() request: Request,
    @Res() response,
  ) {
    const user = request.user;
    return this.brotherhoodService.update(
      id,
      updateBrotherhoodDto,
      user,
      response,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.brotherhoodService.remove(id);
  }

  @Get(':category')
  @Roles('admin', 'moderador', 'user')
  @UseGuards(AuthGuard('jwt'))
  async getProductsByCategory(@Param('category') category: string) {
    const products =
      await this.brotherhoodService.findProductsByCategory(category);
    return products;
  }
}
