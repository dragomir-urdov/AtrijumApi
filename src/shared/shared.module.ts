import { Global, Module } from '@nestjs/common';

import { SharedService } from '@shared/services/shared.service';

@Global()
@Module({
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
