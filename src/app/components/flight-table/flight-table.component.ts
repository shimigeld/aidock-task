import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlightRecord } from 'src/app/models/flight-record';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FlightService } from 'src/app/services/flight.service';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'flight-table',
  templateUrl: './flight-table.component.html',
  styleUrls: ['./flight-table.component.scss']
})
export class FlightTableComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['destination', 'departure', 'arrival', 'connections', 'price' , 'length'];
  dataSource: MatTableDataSource<FlightRecord>;
  isFoundFlights = undefined;
  private flightsSearchResultSubscription: Subscription;

  constructor(private flightService: FlightService) { }
  ngOnInit(): void {
    this.flightsSearchResultSubscription = this.flightService.searchFligthsResult.subscribe(data => {
      if (!data) {
        this.isFoundFlights = undefined;
      } else {
        if (data?.length > 0) {
          this.isFoundFlights = true;
          this.dataSource = new MatTableDataSource(data);
        } else {
          this.isFoundFlights = false;
        }
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.isFoundFlights) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy(): void {
    this.flightsSearchResultSubscription.unsubscribe();
  }
}
