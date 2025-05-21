import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ItineraryService } from './itinerary.service';
import { ItineraryDto } from './dto/itinerary.dto';

@ApiTags('itinerary')
@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post('sort')
  @ApiOperation({
    summary: 'Create a connected journey by automatically sorting tickets',
  })
  @ApiCreatedResponse({
    description: 'The sorted itinerary with tickets in logical travel order',
    type: ItineraryDto,
  })
  createItinerary(@Body() itineraryDto: ItineraryDto): ItineraryDto {
    return this.itineraryService.createItinerary(itineraryDto);
  }

  @Post('readable')
  @ApiOperation({
    summary: 'Generate step-by-step travel instructions from ticket data',
  })
  @ApiCreatedResponse({
    description: 'The human-readable itinerary as a formatted text string',
    schema: {
      type: 'string',
      example:
        '0. Start.\n1. Board train RJX 765, Platform 3 from St. Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.\n...',
    },
  })
  getHumanReadableItinerary(@Body() itineraryDto: ItineraryDto): string {
    return this.itineraryService.getHumanReadableItinerary(itineraryDto);
  }
}
