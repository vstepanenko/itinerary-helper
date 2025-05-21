import { Test, TestingModule } from '@nestjs/testing';

import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { ItineraryDto } from './dto/itinerary.dto';
import { TransportType } from './enums/transport-type.enum';

describe('ItineraryController', () => {
  let controller: ItineraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItineraryController],
      providers: [ItineraryService],
    }).compile();

    controller = module.get<ItineraryController>(ItineraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sortItinerary', () => {
    it('should sort tickets based on connections', () => {
      // Input tickets in random order
      const input: ItineraryDto = {
        tickets: [
          {
            transitType: TransportType.AIRPLANE,
            from: 'Innsbruck Airport',
            to: 'Venice Airport',
            details: {
              flightNumber: 'AA904',
              gate: '10',
              seatNumber: '18B',
              luggageInstructions: 'Self-check-in luggage at counter.',
            },
          },
          {
            transitType: TransportType.TRAIN,
            from: 'St. Anton am Arlberg Bahnhof',
            to: 'Innsbruck Hbf',
            details: {
              trainNumber: 'RJX 765',
              platform: '3',
              seatNumber: '17C',
            },
          },
          {
            transitType: TransportType.TRAIN,
            from: 'Venice Airport',
            to: 'Bologna San Ruffillo',
            details: {
              trainNumber: 'ICN 35780',
              platform: '1',
              seatNumber: '13F',
            },
          },
          {
            transitType: TransportType.TRAM,
            from: 'Innsbruck Hbf',
            to: 'Innsbruck Airport',
            details: {
              tramLine: 'S5',
            },
          },
        ],
      };

      // Expected output tickets in sorted order
      const expected: ItineraryDto = {
        tickets: [
          {
            transitType: TransportType.TRAIN,
            from: 'St. Anton am Arlberg Bahnhof',
            to: 'Innsbruck Hbf',
            details: {
              trainNumber: 'RJX 765',
              platform: '3',
              seatNumber: '17C',
            },
          },
          {
            transitType: TransportType.TRAM,
            from: 'Innsbruck Hbf',
            to: 'Innsbruck Airport',
            details: {
              tramLine: 'S5',
            },
          },
          {
            transitType: TransportType.AIRPLANE,
            from: 'Innsbruck Airport',
            to: 'Venice Airport',
            details: {
              flightNumber: 'AA904',
              gate: '10',
              seatNumber: '18B',
              luggageInstructions: 'Self-check-in luggage at counter.',
            },
          },
          {
            transitType: TransportType.TRAIN,
            from: 'Venice Airport',
            to: 'Bologna San Ruffillo',
            details: {
              trainNumber: 'ICN 35780',
              platform: '1',
              seatNumber: '13F',
            },
          },
        ],
      };

      const result = controller.createItinerary(input);
      expect(result).toEqual(expected);
    });
  });

  describe('getHumanReadableItinerary', () => {
    it('should format tickets into a human-readable itinerary', () => {
      const itineraryDto: ItineraryDto = {
        tickets: [
          {
            transitType: TransportType.TRAIN,
            from: 'London',
            to: 'Paris',
            details: {
              trainNumber: 'Eurostar 9031',
              platform: '5',
              seatNumber: '12A',
            },
          },
        ],
      };

      const readableItinerary =
        controller.getHumanReadableItinerary(itineraryDto);

      expect(typeof readableItinerary).toBe('string');
      expect(readableItinerary).toContain('0. Start.');
      expect(readableItinerary).toContain('London');
      expect(readableItinerary).toContain('Paris');
      expect(readableItinerary).toContain('Eurostar 9031');
      expect(readableItinerary).toContain('2. Last destination reached.');
    });
  });
});
