import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchFormGroup: FormGroup;
  connectionSelectorsValues: Array<[string, number]>;
  flightMaxPrice: number;
  flightDateRange: [Date, Date];

  private dataIsLoadersSubscription: Subscription;

  constructor(formBuilder: FormBuilder, private flightService: FlightService) {
    this.searchFormGroup = formBuilder.group({
      destination: [null],
      departure: [null, Validators.required],
      arrival: [null, Validators.required],
      price: [null, Validators.required],
      connections: [null, Validators.required]
    });
   }

  ngOnInit(): void {
    this.dataIsLoadersSubscription = this.flightService.dataIsLoader.subscribe(isFlightDataLoaded => {
      if (isFlightDataLoaded) {
        this.connectionSelectorsValues = this.flightService.getConnectionsSelectors();
        this.flightMaxPrice = this.flightService.getFlightsMaxPrice();
        this.flightDateRange = this.flightService.getflightsDateRange();

        this.setInitalFormValues(this.searchFormGroup);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataIsLoadersSubscription.unsubscribe();
  }

  public onSliderChanged(input: MatSliderChange): void {
    this.searchFormGroup.get('price').setValue(input.value);
  }

  public resetForm(): void {
    this.searchFormGroup.reset();
    this.setInitalFormValues(this.searchFormGroup);
    this.flightService.searchFligthsResult.next(null);
  }

  public onSubmit(): void {
    this.flightService.searchFlights(this.searchFormGroup.value);
  }

  private setInitalFormValues(formGroup: FormGroup): void {
    formGroup.setValue({
      destination: '',
      departure: this.flightDateRange[0],
      arrival: this.flightDateRange[1],
      price: this.flightMaxPrice,
      connections: this.connectionSelectorsValues[this.connectionSelectorsValues.length - 1][1]
    });
  }

}
