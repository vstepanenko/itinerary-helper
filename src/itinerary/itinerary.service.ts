import { Injectable } from '@nestjs/common';

import { TicketDto } from './dto/ticket.dto';
import { TransportType } from './enums/transport-type.enum';
import { ItineraryDto } from './dto/itinerary.dto';

@Injectable()
export class ItineraryService {
  createItinerary(itineraryDto: ItineraryDto): ItineraryDto {
    const sortedTickets = this.sortTickets(itineraryDto.tickets);

    return {
      tickets: sortedTickets,
    };
  }

  getHumanReadableItinerary(itineraryDto: ItineraryDto): string {
    const sortedTickets = this.sortTickets(itineraryDto.tickets);
    return this.generateHumanReadableItinerary(sortedTickets);
  }

  private sortTickets(tickets: TicketDto[]): TicketDto[] {
    const fromMap = new Map<string, TicketDto>();
    const toSet = new Set<string>();

    tickets.forEach((ticket) => {
      fromMap.set(ticket.from, ticket);
      toSet.add(ticket.to);
    });

    let start = '';
    for (const from of fromMap.keys()) {
      if (!toSet.has(from)) {
        start = from;
        break;
      }
    }

    const sorted: TicketDto[] = [];
    while (fromMap.has(start)) {
      const ticket = fromMap.get(start)!;
      sorted.push(ticket);
      start = ticket.to;
    }

    return sorted;
  }

  private generateHumanReadableItinerary(tickets: TicketDto[]): string {
    let result = '0. Start.\n';

    tickets.forEach((ticket, index) => {
      const stepNumber = index + 1;
      let description: string;

      switch (ticket.transitType) {
        case TransportType.TRAIN: {
          const details = ticket.details as any;
          description = `Board train ${details.trainNumber}, Platform ${details.platform} from ${ticket.from} to ${ticket.to}.`;
          if (details.seatNumber) {
            description += ` Seat number ${details.seatNumber}.`;
          }
          break;
        }
        case TransportType.TRAM: {
          const details = ticket.details as any;
          description = `Board the Tram ${details.tramLine} from ${ticket.from} to ${ticket.to}.`;
          break;
        }
        case TransportType.BUS: {
          const details = ticket.details as any;
          description = `Board the ${details.busLine ? details.busLine + ' ' : ''}bus from ${ticket.from} to ${ticket.to}.`;
          if (details.seatNumber) {
            description += ` Seat number ${details.seatNumber}.`;
          } else {
            description += ' No seat assignment.';
          }
          break;
        }
        case TransportType.AIRPLANE: {
          const details = ticket.details as any;
          description = `From ${ticket.from}, board the flight ${details.flightNumber} to ${ticket.to} from gate ${details.gate}`;
          if (details.seatNumber) {
            description += `, seat ${details.seatNumber}`;
          }
          description += '.';
          if (details.luggageInstructions) {
            description += ` ${details.luggageInstructions}`;
          }
          break;
        }
        case TransportType.BOAT: {
          const details = ticket.details as any;
          description = `Board the boat ${details.boatName} from ${ticket.from} to ${ticket.to}.`;
          if (details.deckOrCabin) {
            description += ` Deck/Cabin ${details.deckOrCabin}.`;
          }
          break;
        }
        case TransportType.TAXI: {
          const details = ticket.details as any;
          description = `Take a taxi${details.taxiIdentifier ? ' (' + details.taxiIdentifier + ')' : ''} from ${ticket.from} to ${ticket.to}.`;
          break;
        }
        default:
          description = `Travel from ${ticket.from} to ${ticket.to}.`;
      }

      result += `${stepNumber}. ${description}\n`;
    });

    result += `${tickets.length + 1}. Last destination reached.`;
    return result;
  }
}
