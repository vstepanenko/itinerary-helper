import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ItineraryModule } from './itinerary/itinerary.module';

@Module({
  imports: [ItineraryModule],
  controllers: [AppController],
})
export class AppModule {}
