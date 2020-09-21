import { Component, OnInit } from '@angular/core';
import { FlightRecord } from './models/flight-record';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  flightsData: Array<FlightRecord>;

  constructor() {
  }

}
