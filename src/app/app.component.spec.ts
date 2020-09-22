import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AppComponent } from './app.component';
import { FlightTableComponent } from './components/flight-table/flight-table.component';
import { SearchComponent } from './components/search/search.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create AppComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });
});
