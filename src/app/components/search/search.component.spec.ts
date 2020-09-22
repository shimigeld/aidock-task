import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { FlightService } from 'src/app/services/flight.service';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

import { SearchComponent } from './search.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { AppModule } from 'src/app/app.module';
import { Subject } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let flightService: FlightService;
  let loader: HarnessLoader;

  const flightServiceStub: Partial<FlightService> = {
    getConnectionsSelectors: () => [['1', 1]],
    getFlightsMaxPrice: () => 800,
    getflightsDateRange: () => [new Date('01/02/2020'), new Date('01/03/2020')],
    dataIsLoader: new Subject<boolean>(),
    searchFlights: () => null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      providers: [FormBuilder, HttpClient, HttpHandler, {
        provide: FlightService, useValue: flightServiceStub}
      ],
      imports: [AppModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    TestBed.inject(FormBuilder);
    flightService = TestBed.inject(FlightService);
    TestBed.inject(HttpClient);
    TestBed.inject(HttpHandler);
  });

  it('should create SearchComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have and to set matSlider max value to 800 ', async () => {
    component.flightMaxPrice = flightService.getFlightsMaxPrice();

    fixture.detectChanges();
    const slider = await loader.getHarness(MatSliderHarness);

    expect(slider).toBeDefined();
    expect(await slider.getMaxValue()).toEqual(800);
  });

  it('should have matSelector on component and at least 1 value option', async () => {
    component.connectionSelectorsValues = flightService.getConnectionsSelectors();
    const select = await loader.getHarness<MatSelectHarness>(MatSelectHarness);
    expect(select).toBeDefined();

    fixture.detectChanges();
    await fixture.whenStable();

    await (await select.host()).click();

    const options = (await select.getOptions());
    expect(options.length).toBeGreaterThanOrEqual(1);
  });

  it('should have matDateRangeInput and min & max value', async () => {
    const dateRange = await loader.getHarness<MatDateRangeInputHarness>(MatDateRangeInputHarness);
    expect(dateRange).toBeDefined();
  });

  it('should have matInput and to have value', async () => {
    component.searchFormGroup.controls.destination.setValue('test');
    const input = await loader.getHarness<MatInputHarness>(MatInputHarness);

    fixture.detectChanges();

    expect(input).toBeDefined();
    expect(await input.getValue()).toEqual('test');
  });

  it('should #onSubmit searchFormGroup to be defined', async () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(component.searchFormGroup.value).toBeDefined();
  });
});
