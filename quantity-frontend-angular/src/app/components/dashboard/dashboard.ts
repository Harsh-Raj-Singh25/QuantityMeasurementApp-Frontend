import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { QuantityService } from '../../services/quantity';
import { AuthService } from '../../services/auth';
import { QuantityInputDTO } from '../../models/quantity.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  unitData: any = {
    'LENGTHUNIT': ['FEET', 'INCHES', 'YARDS', 'CENTIMETER', 'METER', 'KILOMETER'],
    'WEIGHTUNIT': ['KILOGRAM', 'GRAM', 'TONNE'],
    'TEMPERATUREUNIT': ['CELSIUS', 'FAHRENHEIT', 'KELVIN'],
    'VOLUMEUNIT': ['LITER', 'MILLILITER', 'GALLON']
  };

  types = ['Length', 'Weight', 'Temperature', 'Volume'];
  actions = ['Comparison', 'Conversion', 'Arithmetic'];
  
  currentType = 'LENGTHUNIT';
  currentAction = 'COMPARE';
  availableUnits: string[] = [];

  val1: number = 0;
  unit1: string = '';
  val2: number = 0;
  unit2: string = '';

  resultDisplay: string = 'Result: --';
  errorMessage: string = '';

  constructor(private quantityService: QuantityService, private authService: AuthService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.setType('Length');
  }

  setType(type: string): void {
    this.currentType = type.toUpperCase() + 'UNIT';
    this.availableUnits = this.unitData[this.currentType] || [];
    this.unit1 = this.availableUnits[0];
    this.unit2 = this.availableUnits[0];
    this.resultDisplay = 'Result: --';
    this.errorMessage = '';
  }

  setAction(action: string): void {
    if (action === 'Comparison') this.currentAction = 'COMPARE';
    if (action === 'Conversion') this.currentAction = 'CONVERT';
    if (action === 'Arithmetic') this.currentAction = 'ADD';
    this.resultDisplay = 'Result: --';
    this.errorMessage = '';
  }

  calculate(): void {
    this.resultDisplay = 'Calculating...';
    this.errorMessage = '';

    const payload: QuantityInputDTO = {
      thisQuantityDTO: { value: this.val1, unit: this.unit1, measurementType: this.currentType },
      thatQuantityDTO: { value: this.currentAction === 'CONVERT' ? 0 : this.val2, unit: this.unit2, measurementType: this.currentType }
    };

    console.log("1. Payload ready to send: ", payload);
    console.log("2. Current Action is: ", this.currentAction);

    let apiCall;
    if (this.currentAction === 'COMPARE') apiCall = this.quantityService.compare(payload);
    else if (this.currentAction === 'ADD') apiCall = this.quantityService.add(payload);
    else apiCall = this.quantityService.convert(payload);

    console.log("3. API Call initiated, waiting for backend...");

    apiCall.subscribe({
      next: (response: any) => {
        if (this.currentAction === 'COMPARE') {
           this.resultDisplay = `Result: ${response.resultString.toUpperCase()}`;
        } else {
           this.resultDisplay = `Result: ${response.resultValue} ${response.resultUnit}`;
        }
        
        // POKE ANGULAR TO REDRAW THE SCREEN!
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.errorMessage = err.error?.errorMessage || err.message || 'An error occurred';
        this.resultDisplay = 'Error';
        this.cdr.detectChanges(); // Poke it here too just in case!
      }
    });
  }
  logout(): void {
    this.authService.logout();
  }
}