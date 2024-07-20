import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RequestApiService} from "../../services/request-api.service";


export interface CardOption {
  "option": number;
  "description": string[],
  "cards": string[]
}

export interface MVP {
  "name": string;
  "race": string;
  "element": string;
  "size": string;
  "tips": string;
  "event": string;
  // "recommended_cards": any | {
  //   "mao_dominante": CardOption[];
  //   "mao_secundaria": CardOption[];
  //   "armadura": CardOption[];
  //   "capa": CardOption[];
  //   "calcado": CardOption[];
  //   "acessorio": CardOption[];
  //   "chapeu": CardOption[];
  //   "face": CardOption[];
  //   "boca": CardOption[];
  //   "costas": CardOption[];
  //   "fantasia": CardOption[];
  // },
  "recommended_cards": any,
  "thumbnailUrl": string;
  "imageUrl": string;
}

@Component({
  selector: 'app-card-input',
  templateUrl: './card-input.component.html',
  styleUrl: './card-input.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AsyncPipe,
    JsonPipe,
  ],
})
export class CardInputComponent {
  stateCtrl = new FormControl('');
  filteredStates: Observable<MVP[]> | null;

  mvps: MVP[] = [];
  @Output() mvp: EventEmitter<MVP | null> = new EventEmitter<MVP | null>();

  constructor(private requestApiService: RequestApiService) {
    this.getMvps();
    this.filteredStates = null;
  }

  async getMvps() {
    await this.requestApiService.getMvps().then((data) => {
      this.mvps = data;
      this.filteredStates = this.stateCtrl.valueChanges.pipe(
        startWith(''),
        map(state => {
          console.log('State', state);
          this.getMvp(state);
          return state ? this._filterStates(state) : this.mvps.slice();
        })
      );
      // this.filteredStates = this.stateCtrl.valueChanges.pipe(
      //   startWith(''),
      //   map(state => (state ? this._filterStates(state) : this.mvps.slice())),
      // );
    });
  }

  async getMvp(name: string | null) {
    if (name !== null) {
      await this.requestApiService.getMvp(name).then((data) => {
        if (data !== null) {
          this.mvp.emit(data);
        }
      });
    } else {
      this.mvp.emit(null);
    }

  }

  private _filterStates(value: string): MVP[] {
    const filterValue = value.toLowerCase();

    return this.mvps.filter(mvp => {
      const name = mvp.name.toLowerCase().includes(filterValue);
      const race = mvp.race.toLowerCase().includes(filterValue);
      const size = mvp.size.toLowerCase().includes(filterValue);
      const element = mvp.element.toLowerCase().includes(filterValue);

      if (name) {
        return name;
      } else if (race) {
        return race;
      } else if (size) {
        return size;
      } else if (element) {
        return element;
      } else {
        return false;
      }
    });
  }
}
