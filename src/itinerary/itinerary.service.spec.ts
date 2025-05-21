import { Test, TestingModule } from '@nestjs/testing';

import { ItineraryService } from './itinerary.service';
import { ItineraryDto } from './dto/itinerary.dto';
import { TransportType } from './enums/transport-type.enum';

describe('ItineraryService', () => {
  let service: ItineraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItineraryService],
    }).compile();

    service = module.get<ItineraryService>(ItineraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sortItinerary', () => {
    it('should correctly sort a simple connected journey', () => {
      const dto: ItineraryDto = {
        tickets: [
          {
            transitType: TransportType.BUS,
            from: 'B',
            to: 'C',
            details: { busLine: 'Express' },
          },
          {
            transitType: TransportType.TRAIN,
            from: 'A',
            to: 'B',
            details: { trainNumber: '123', platform: '1' },
          },
        ],
      };

      const result = service.createItinerary(dto);
      expect(result.tickets.length).toBe(2);

      // First ticket should be from A to B (since A is not a destination of any ticket)
      expect(result.tickets[0].from).toBe('A');
      expect(result.tickets[0].to).toBe('B');

      // Second ticket should be from B to C (following the connection)
      expect(result.tickets[1].from).toBe('B');
      expect(result.tickets[1].to).toBe('C');
    });
  });

  describe('getHumanReadableItinerary', () => {
    it('should format tickets into a human-readable itinerary', () => {
      const dto: ItineraryDto = {
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
            details: { tramLine: 'S5' },
          },
        ],
      };

      const readable = service.getHumanReadableItinerary(dto);

      expect(readable).toContain('0. Start.');
      expect(readable).toContain('1. Board train RJX 765');
      expect(readable).toContain('2. Board the Tram S5');
      expect(readable).toContain('3. Last destination reached.');
    });

    it('should format different transit types with appropriate descriptions', () => {
      const dto: ItineraryDto = {
        tickets: [
          {
            transitType: TransportType.BUS,
            from: 'A',
            to: 'B',
            details: { busLine: 'Express' },
          },
          {
            transitType: TransportType.AIRPLANE,
            from: 'B',
            to: 'C',
            details: {
              flightNumber: 'AA123',
              gate: '5',
              seatNumber: '10B',
              luggageInstructions: 'Check luggage at counter.',
            },
          },
          {
            transitType: TransportType.BOAT,
            from: 'C',
            to: 'D',
            details: {
              boatName: 'Ferry One',
              deckOrCabin: 'Upper Deck',
            },
          },
          {
            transitType: TransportType.TAXI,
            from: 'D',
            to: 'E',
            details: {
              taxiIdentifier: 'Yellow Cab 42',
            },
          },
        ],
      };

      const readable = service.getHumanReadableItinerary(dto);

      expect(readable).toContain('1. Board the Express bus');
      expect(readable).toContain('2. From B, board the flight AA123');
      expect(readable).toContain('3. Board the boat Ferry One');
      expect(readable).toContain('4. Take a taxi (Yellow Cab 42)');
    });
  });
});
