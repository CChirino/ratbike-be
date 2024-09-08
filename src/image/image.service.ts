import { Injectable } from '@nestjs/common';
import { WallService } from 'src/wall/wall.service';

@Injectable()
export class ImageService {
  constructor(private readonly wallService: WallService) {}

  // Recopilar todas las rutas de imágenes de diferentes servicios
  async findAllImages(): Promise<{ path: string }[]> {
    const wallImages = await this.wallService.findAllImages();

    // Combinar todas las imágenes en un solo array
    return [...wallImages]; // Añadir más arrays según sea necesario
  }
}
