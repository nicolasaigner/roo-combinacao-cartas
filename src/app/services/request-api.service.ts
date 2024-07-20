import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MVP} from "../components/card-input/card-input.component";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RequestApiService {

  apiUrl: string = environment.apiUrl;

  constructor(private httpService: HttpClient) { }

  getMvps(): Promise<MVP[]> {
    return new Promise((resolve, reject) => {
      this.httpService.get<MVP[]>(`${this.apiUrl}/mvps`).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      })
    });
  }

  getMvp(name: string): Promise<MVP | null> {
    return new Promise(async(resolve, reject) => {
      await this.httpService.get<MVP[] | []>(`${this.apiUrl}/mvps?Name=${name}`).subscribe({
        next: (data) => {
          if (data.length > 0) resolve(data[0]); else {
            resolve(null)
          }
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  getImageCard(name: string): Observable<string> {
    return this.httpService.get<any>(`${this.apiUrl}/cards?nome=${encodeURIComponent(name)}`).pipe(
      map(card => card.length > 0 ? card[0].imageUrl : '')
    );
  }
}
