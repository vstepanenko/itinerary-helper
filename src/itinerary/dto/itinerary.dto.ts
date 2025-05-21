import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { TicketDto } from './ticket.dto';

export class ItineraryDto {
  @ApiProperty({
    type: [TicketDto],
    description: 'Array of tickets for the itinerary',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one ticket must be provided' })
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
