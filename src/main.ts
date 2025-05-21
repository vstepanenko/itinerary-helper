import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import {
  AirplaneTicketDetails,
  BoatTicketDetails,
  BusTicketDetails,
  TaxiTicketDetails,
  TrainTicketDetails,
  TramTicketDetails,
} from './itinerary/dto/ticket.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Itinerary Helper API')
    .setDescription(
      'API for sorting travel tickets to help Kevin find his family',
    )
    .setVersion('1.0')
    .addTag('itinerary')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      TrainTicketDetails,
      TramTicketDetails,
      BusTicketDetails,
      AirplaneTicketDetails,
      BoatTicketDetails,
      TaxiTicketDetails,
    ],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
