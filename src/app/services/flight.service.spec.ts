import {  TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FlightService } from './flight.service';
import { FlightRecord } from '../models/flight-record';
import { TestScheduler } from 'rxjs/testing';

describe('FlightService', () => {
  let flightService: FlightService;
  let testScheduler: TestScheduler;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightService, HttpClient, HttpHandler]
    });

    flightService = TestBed.inject(FlightService);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

  });

  const data = [
      {
        destination: 'Austin',
        departure: '02/01/2020',
        arrival: '02/02/2020',
        connections: 2,
        price: 500,
        length: 9
    },
    {
        destination: 'LAX',
        departure: '02/03/2020',
        arrival: '02/04/2020',
        connections: 1,
        price: 800,
        length: 8
    }];


  it('should be created FlightService', () => {
    expect(flightService).toBeTruthy();
  });

  it('should check if #dataIsLoader is true (check that data is loaded)', async () => {
    (flightService as any).fetchFlightData();
    expect(flightService.dataIsLoader).toBeTruthy();
  });

  it('should check if #getConnectionsSelectors has value', () => {
    (flightService as any).flightsData = data;
    const selectorsValues = flightService.getConnectionsSelectors();
    expect(selectorsValues.length).toBeGreaterThan(0);
  });

  it('should check if #getFlightsMaxPrice has value and is a Number', () => {
    (flightService as any).flightsData = data;
    const maxPrice = flightService.getFlightsMaxPrice();
    expect(maxPrice).toEqual(jasmine.any(Number));
    expect(maxPrice).toBeDefined();
    expect(maxPrice).toBeGreaterThan(0);
  });

  it('should check if #getflightsDateRange has value and is array of Date and have precisely 2 values', () => {
    (flightService as any).flightsData = data;
    const dateRange = flightService.getflightsDateRange();
    expect(Array.isArray(dateRange)).toBeTruthy();
    expect(dateRange).toBeDefined();
    expect(dateRange.length).toEqual(2);
  });

  it('should check if #searchFlights return filter values', () => {
    (flightService as any).flightsData = data;
    const searchInput: FlightRecord = {
      destination: 'Aus',
      departure: new Date('02/01/2020'),
        arrival: new Date('02/02/2020'),
        connections: 2,
        price: 500,
        length: 9
    };

    flightService.searchFlights(searchInput);
    flightService.searchFligthsResult.subscribe(res => {
      expect(res.length).toBeGreaterThan(0);
    });
  });

});
