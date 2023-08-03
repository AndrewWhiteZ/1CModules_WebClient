import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  private dataSubject = new BehaviorSubject('Data');
  currentStage = this.dataSubject.asObservable();

  constructor() { }

  updateCurrentData(data: any): void {
    this.dataSubject.next(data); 
  }

  getCurrentData(): Observable<any> {
    return this.dataSubject.asObservable();
  }

}
