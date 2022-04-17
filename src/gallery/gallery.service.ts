import { Injectable, NotFoundException } from '@nestjs/common';

import { readdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class GalleryService {
  /**
   * It returns all available albums.
   *
   * @author Dragomir Urdov
   * @returns Albums name.
   */
  async getAlbums() {
    try {
      const albums = await readdir(join(process.cwd(), 'files'));
      const images = await Promise.all(
        albums.map(async (album) => {
          return await readdir(join(process.cwd(), 'files', album));
        }),
      );

      const response = {};

      albums.forEach((album, index) => {
        response[album] = images[index];
      });

      return response;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  /**
   * It returns all images name from specified album.
   *
   * @author Dragomir Urdov
   * @param album Album name.
   * @returns Images name.
   */
  async getAllImages(album: string) {
    try {
      return await readdir(join(process.cwd(), 'files', album));
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
