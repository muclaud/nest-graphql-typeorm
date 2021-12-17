import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { FileUploadService } from './file-upload.service';
import { File } from './entities/file-upload.entity';

@Resolver(() => File)
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Query(() => File, { name: 'getImageById' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.fileUploadService.findById(id);
  }
}
