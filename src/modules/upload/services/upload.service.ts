import { Injectable } from '@nestjs/common';
import { parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

import {
  BadRequestException,
  UnauthorizedException,
} from 'src/common/exceptions';

@Injectable()
export class UploadService {
  generateVideoKey(userId: string, videoId: string, fileName: string) {
    const formattedFilename = encodeURIComponent(fileName);
    return `videos/${userId}/${videoId}/source/${formattedFilename}`;
  }

  generateImageKey(userId: string, fileType: string) {
    const ext = fileType.split('/')[1];
    return `images/${userId}/${uuidv4()}.${ext}`;
  }

  verifyFileKey(key: string | undefined, userId: string) {
    if (!key) return false;

    const { userId: id } = this.parseKey(key);
    const isLocal = !key.startsWith('http');

    if (isLocal && id !== userId) {
      throw new UnauthorizedException('File not belong to user');
    }

    return isLocal;
  }

  verifyImageFileType(fileType: string) {
    const type = fileType.split('/')[0];

    if (type !== 'image') {
      throw new BadRequestException('Invalid file type');
    }
  }

  verifyVideoFileType(fileType: string) {
    const type = fileType.split('/')[0];

    if (type !== 'video') {
      throw new BadRequestException('Invalid file type');
    }
  }

  parseKey(key: string) {
    const names = key.split('/');
    const { ext } = parse(key);
    return { userId: names[1], ext };
  }

  parseVideoKey(key: string) {
    const names = key.split('/');
    const { ext } = parse(key);
    return { userId: names[1], videoId: names[2], location: names[3], ext };
  }
}
