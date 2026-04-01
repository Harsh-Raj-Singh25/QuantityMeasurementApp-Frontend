import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { QuantityService } from '../../services/quantity';
import { AuthService } from '../../services/auth';
import { QuantityInputDTO } from '../../models/quantity.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  
  activeTab: 'calculator' | 'history' | 'profile' = 'calculator';
  isGuest: boolean = false;

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

  val1: number = 0; unit1: string = '';
  val2: number = 0; unit2: string = '';
  
  resultDisplay: string = 'Result: --';
  errorMessage: string = '';
  
  historyRecords: any[] = [];
  
  // 1. Set a blank default profile
  userProfile = {
    name: 'Loading...',
    email: 'Loading...',
    role: 'Premium Member',
    joined: 'Today'
  };

  // 2. Update ngOnInit to read from LocalStorage
  ngOnInit(): void {
    this.isGuest = localStorage.getItem('guest_mode') === 'true';
    
    // If they are NOT a guest, load their real details!
    if (!this.isGuest) {
      const storedName = localStorage.getItem('user_name');
      const storedEmail = localStorage.getItem('user_email');

      this.userProfile = {
        name: storedName || 'Google User', // Fallback if they used Google Login
        email: storedEmail || 'connected@google.com',
        role: 'Premium Member',
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    }

    this.setType('Length'); 
  }

  constructor(
    private quantityService: QuantityService, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  switchTab(tab: 'calculator' | 'history' | 'profile'): void {
    if (this.isGuest && (tab === 'history' || tab === 'profile')) {
      if (confirm("This feature requires an account. Would you like to login or sign up?")) {
        this.logout(); 
      }
      return; 
    }
    this.activeTab = tab;
    if (tab === 'history') this.loadHistory();
  }

  loadHistory(): void {
    const userEmail = localStorage.getItem('user_email');
    
    if (!userEmail) {
      this.historyRecords = [];
      return;
    }

    // Look for a specific storage key like "history_john@doe.com"
    const historyKey = `history_${userEmail}`;
    const savedHistory = localStorage.getItem(historyKey);

    if (savedHistory) {
      // If they have history, parse the JSON and display it
      this.historyRecords = JSON.parse(savedHistory);
    } else {
      // If they are a brand new user, start with an empty table!
      this.historyRecords = []; 
    }
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

    let apiCall;
    if (this.currentAction === 'COMPARE') apiCall = this.quantityService.compare(payload);
    else if (this.currentAction === 'ADD') apiCall = this.quantityService.add(payload);
    else apiCall = this.quantityService.convert(payload);

    apiCall.subscribe({
      next: (response: any) => {
        // 1. Determine the result text
        let resultText = '';
        if (this.currentAction === 'COMPARE') {
           resultText = response.resultString.toUpperCase();
        } else {
           resultText = `${response.resultValue} ${response.resultUnit}`;
        }
        this.resultDisplay = `Result: ${resultText}`;
        
        // 2. SAVE TO HISTORY (If they are logged in)
        if (!this.isGuest) {
          const userEmail = localStorage.getItem('user_email');
          if (userEmail) {
            // Format what the user typed in
            let inputText = `${this.val1} ${this.unit1}`;
            if (this.currentAction !== 'CONVERT') {
              inputText += ` & ${this.val2} ${this.unit2}`;
            }

            // Create the new record
            const newRecord = { 
              date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), 
              type: this.currentType.replace('UNIT', ''), 
              action: this.currentAction, 
              input: inputText, 
              output: resultText 
            };

            // Pull their existing history, add the new record to the top, and save it back
            const historyKey = `history_${userEmail}`;
            const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
            existingHistory.unshift(newRecord); // unshift puts it at the top of the list
            localStorage.setItem(historyKey, JSON.stringify(existingHistory));
          }
        }

        this.cdr.detectChanges(); 
      }
    });
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('guest_mode');
    this.authService.logout();
  }
}