import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UnauthorizedException } from 'src/common/exceptions';

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

    const id = key.split('/')[1];
    const isLocal = !key.startsWith('http');

    if (isLocal && id !== userId) {
      throw new UnauthorizedException('File not belong to user');
    }

    return isLocal;
  }
}
