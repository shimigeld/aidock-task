import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlightRecord } from '../models/flight-record';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private flightsData: Array<FlightRecord>;
  public dataIsLoader = new Subject<boolean>();
  public searchFligthsResult = new Subject<Array<FlightRecord>>();
  constructor(private httpClient: HttpClient) {
    this.fetchFlightData();
  }

  private fetchFlightData(): void {
     this.httpClient.get<Array<FlightRecord>>('./assets/flights.json').pipe(map(res => {
      return res.map(record => {
        record.departure = new Date(record.departure);
        record.arrival = new Date(record.arrival);

        return record;
      });
     })).toPromise().then(res => {
        this.flightsData = res;
        this.dataIsLoader.next(true);
     });
  }

  public getConnectionsSelectors(): Array<[string, number]> {
    const connectionsSet = [...new Set<number>(this.flightsData.map(flight => flight.connections))];
    if (connectionsSet.length > 0) {
      const result: Array<[string, number]> = [];
      connectionsSet.forEach(set => {
        if (set === 0) {
          result.push(['Direct flight', 0]);
        } else {
          result.push([set.toString(), set]);
        }
      });

      result.sort((a, b) => a[1] > b[1] ? 1 : -1);
      return result;
    } else {
      return null;

    }
  }

  public getFlightsMaxPrice(): number {
    const maxPrice = Math.max(...this.flightsData.map(flight => flight.price), 0);

    return maxPrice;
  }

  public getflightsDateRange(): [Date, Date] {
    const minDate = this.flightsData.reduce((a, b) => a.departure < b.departure ? a : b).departure;
    const maxDate = this.flightsData.reduce((a, b) => a.arrival > b.arrival ? a : b).arrival;

    return [minDate, maxDate];
  }

  public searchFlights(input: FlightRecord): void {
    let flitredFligths = this.flightsData.filter(flight => {
      return flight.connections <= input.connections &&
      flight.price <= input.price &&
      flight.departure.valueOf() >= input.departure.valueOf() &&
      flight.arrival.valueOf() <= input.arrival.valueOf();
    });

    if (input.destination !== '') {
      flitredFligths = flitredFligths.filter(flight => flight.destination.toLowerCase().includes(input.destination.trim().toLowerCase()));
    }

    this.searchFligthsResult.next(flitredFligths);
  }

}
