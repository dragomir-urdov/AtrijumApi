import { Global, Module } from '@nestjs/common';
import { SharedService } from './shared.service';

@Global()
@Module({
  providers: [SharedService],
})
export class SharedModule {}
