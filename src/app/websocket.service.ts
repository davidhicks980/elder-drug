import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket: any; //socket that connects to socket.io server
  readonly uri: string = 'ws://localhost:8080';

  constructor() {
    this.socket = io(this.uri); //initiates socket instance
  }
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  mapData(data: any[], filter?: string) {
    let arrayOfMedInfo: BeersEntry[] = data;
    let filteredArray = [];
    if (filter != null) {
      arrayOfMedInfo.forEach((element) => {
        if (element[filter] != null) {
          filteredArray.push(element);
        }
      });
    } else {
      filteredArray = arrayOfMedInfo;
    }
    return filteredArray;
  }

  emit(messageID: string, data: any) {
    this.socket.emit(messageID, data);
  }
}
export interface BeersEntry {
  EntryID?: number;
  DiseaseState?: string;
  Category?: number;
  Item?: string;
  MinimumClearance?: number;
  MaximumClearance?: number;
  Interaction?: string;
  Inclusion?: string;
  Exclusion?: string;
  Rationale?: string;
  Recommendation?: string;
  RecommendationLineTwo?: string;
  ItemType?: string;
  ShortName?: string;
}
