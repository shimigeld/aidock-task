import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { FlightRecord } from 'src/app/models/flight-record';
import { FlightService } from 'src/app/services/flight.service';

import { FlightTableComponent } from './flight-table.component';

describe('FlightTableComponent', () => {
  let component: FlightTableComponent;
  let fixture: ComponentFixture<FlightTableComponent>;

  let flightServiceStub: Partial<FlightService>;
  let flightService: FlightService;
  flightServiceStub = {
    dataIsLoader: new Subject<boolean>(),
    searchFligthsResult: new Subject<Array<FlightRecord>>()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightTableComponent ],
      providers: [ {provide: FlightService, useValue: flightServiceStub }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTableComponent);
    component = fixture.componentInstance;
    flightService = TestBed.inject(FlightService);
  });

  it('should create FlightTableComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should show div if dataIsLoader is false', () => {
    flightService.dataIsLoader.next(false);
    const div = fixture.nativeElement.querySelector('div');
    fixture.detectChanges();
    expect(div).toBeDefined();
  });

  it('should show table if dataIsLoader is true', () => {
    flightService.dataIsLoader.next(true);
    const table = fixture.nativeElement.querySelector('table');
    const th = fixture.nativeElement.querySelector('th');

    fixture.detectChanges();
    expect(table).toBeDefined();
    expect(th).toBeDefined();

  });

  it('shouldn\'t show anything if dataIsLoader is null', () => {
    flightService.dataIsLoader.next(null);
    const table = fixture.nativeElement.querySelector('table');
    const div = fixture.nativeElement.querySelector('div');
    fixture.detectChanges();
    expect(table).toBeFalsy();
    expect(div).toBeFalsy();
  });


  it('should show data in table when searchFligthsResult has data', () => {
    const flightData = [{
      destination: 'Austin',
      departure: new Date('02/02/2020'),
      arrival: new Date('02/02/2020'),
      connections: 2,
      price: 500,
      length: 9
    },
    {
      destination: 'Austin',
      departure: new Date('02/02/2020'),
      arrival: new Date('02/02/2020'),
      connections: 2,
      price: 500,
      length: 9
    }
    ];

    flightService.dataIsLoader.next(true);
    flightService.searchFligthsResult.next(flightData);

    fixture.detectChanges();
    const td = fixture.nativeElement.querySelector('td');

    expect(td).toBeDefined();
  });

});
