import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { TransportType } from '../enums/transport-type.enum';

export class TrainTicketDetails {
  @ApiProperty({ description: 'Train number/name' })
  @IsNotEmpty()
  @IsString()
  trainNumber: string;

  @ApiProperty({ description: 'Platform number' })
  @IsNotEmpty()
  @IsString()
  platform: string;

  @ApiProperty({ description: 'Seat number' })
  @IsOptional()
  @IsString()
  seatNumber?: string;
}

export class TramTicketDetails {
  @ApiProperty({ description: 'Tram line' })
  @IsNotEmpty()
  @IsString()
  tramLine: string;
}

export class BusTicketDetails {
  @ApiProperty({ description: 'Bus line or number', required: false })
  @IsOptional()
  @IsString()
  busLine?: string;
}

export class AirplaneTicketDetails {
  @ApiProperty({ description: 'Flight number' })
  @IsNotEmpty()
  @IsString()
  flightNumber: string;

  @ApiProperty({ description: 'Gate number' })
  @IsNotEmpty()
  @IsString()
  gate: string;

  @ApiProperty({ description: 'Seat number' })
  @IsOptional()
  @IsString()
  seatNumber?: string;

  @ApiProperty({ description: 'Luggage instructions' })
  @IsOptional()
  @IsString()
  luggageInstructions?: string;
}

export class BoatTicketDetails {
  @ApiProperty({ description: 'Boat name or number' })
  @IsNotEmpty()
  @IsString()
  boatName: string;

  @ApiProperty({ description: 'Deck or cabin number', required: false })
  @IsOptional()
  @IsString()
  deckOrCabin?: string;
}

export class TaxiTicketDetails {
  @ApiProperty({ description: 'Taxi company or car number', required: false })
  @IsOptional()
  @IsString()
  taxiIdentifier?: string;
}

@ApiExtraModels(
  TrainTicketDetails,
  TramTicketDetails,
  BusTicketDetails,
  AirplaneTicketDetails,
  BoatTicketDetails,
  TaxiTicketDetails,
)
export class TicketDto {
  @ApiProperty({
    enum: TransportType,
    description: 'Type of transportation',
  })
  @IsEnum(TransportType)
  transitType: TransportType;

  @ApiProperty({ description: 'Departure location' })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({ description: 'Arrival location' })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({
    description: 'Details specific to this type of transit',
    oneOf: [
      { $ref: getSchemaPath(TrainTicketDetails) },
      { $ref: getSchemaPath(TramTicketDetails) },
      { $ref: getSchemaPath(BusTicketDetails) },
      { $ref: getSchemaPath(AirplaneTicketDetails) },
      { $ref: getSchemaPath(BoatTicketDetails) },
      { $ref: getSchemaPath(TaxiTicketDetails) },
    ],
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  details:
    | TrainTicketDetails
    | TramTicketDetails
    | BusTicketDetails
    | AirplaneTicketDetails
    | BoatTicketDetails
    | TaxiTicketDetails;
}
