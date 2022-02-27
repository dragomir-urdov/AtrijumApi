import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Language } from '@shared/entities/language.entity';

// Services
import { SharedService } from '@shared/services/shared.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
