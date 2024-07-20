import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CardInputComponent, MVP} from "./components/card-input/card-input.component";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatTab, MatTabGroup, MatTabsModule} from "@angular/material/tabs";
import {AsyncPipe, DatePipe, JsonPipe} from "@angular/common";
import {forkJoin, Observable, Observer} from "rxjs";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitleGroup} from "@angular/material/card";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {map, startWith} from "rxjs/operators";
import {RequestApiService} from "./services/request-api.service";
import {MatDivider} from "@angular/material/divider";
import {MatInput} from "@angular/material/input";

// Definindo a interface para os dados da tabela
export interface MonsterGroup {
  set: string;
  raceAndSize: string;
  monsters: string;
}

// Dados dos agrupamentos de monstros
export const MONSTER_GROUPS: MonsterGroup[] = [
  { set: 'Set 1', raceAndSize: 'Anjo/Médio', monsters: 'Angeling' },
  { set: 'Set 2', raceAndSize: 'Inseto/Grande', monsters: 'Besouro-Ladrão Dourado, Maya' },
  { set: 'Set 3', raceAndSize: 'Demônio/Médio', monsters: 'Deviling, Flor do Luar, Doppelganger' },
  { set: 'Set 4', raceAndSize: 'Humanoide/Grande', monsters: 'Orc Herói, Senhor dos Orcs, Faraó' },
  { set: 'Set 5', raceAndSize: 'Humanoide/Médio', monsters: 'Goblin, Jogadores, Sílfide' },
  { set: 'Set 6', raceAndSize: 'Morto-Vivo/Médio', monsters: 'Drake, Osíris' },
  { set: 'Set 7', raceAndSize: 'Bruto/Grande', monsters: 'Eddga, Freeoni, Quimera, Hatti, Wendine' },
  { set: 'Set 8', raceAndSize: 'Inseto/Pequeno', monsters: 'Abelha-Rainha' },
  { set: 'Set 9', raceAndSize: 'Demônio/Grande', monsters: 'Drácula, Bafomé, Barão Coruja, Lorde das Trevas, Gerente do Tempo' },
  { set: 'Set 10', raceAndSize: 'Amorfo/Grande', monsters: 'Cavaleiro Sanguinário, Cavaleiro da Tempestade, Gnomo' },
  { set: 'Set 11', raceAndSize: 'Planta/Pequeno', monsters: 'Ódio, Pesar' },
  { set: 'Set 12', raceAndSize: 'Dragão/Grande', monsters: 'Dragão Mutante' },
  { set: 'Set 13', raceAndSize: 'PeixePequeno/Médio', monsters: 'Maior General' },
  { set: 'Set 14', raceAndSize: 'Amorfo/Médio', monsters: 'Salamandra' },
  { set: 'Set 15', raceAndSize: 'Fantasma/Grande', monsters: 'Mestre Elementar' },
];

// O total de monstros abrangidos pelos 15 sets é 34, conforme mencionado.



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCardModule,
    RouterOutlet,
    CardInputComponent,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatButton,
    MatTabGroup,
    MatTab,
    MatTabsModule,
    AsyncPipe,
    DatePipe,
    MatCard,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardContent,
    JsonPipe,
    MatChipSet,
    MatChip,
    MatGridList,
    MatGridTile,
    MatFormField,
    MatSelect,
    MatOption,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDivider,
    MatInput
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  dataSource: MVP[] = [];
  columnsToDisplay = ['name', 'race', 'element', 'size', 'event'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null | undefined;

  displayedColumns: string[] = ['set', 'raceAndSize', 'monsters'];
  dataSourceCardBelt = new MatTableDataSource<MonsterGroup>(MONSTER_GROUPS);

  tabLoadTimes: Date[] = [];

  equipmentsCards = [
    {
      title: "Chapéu",
      column: 1,
      attribute: "chapeu",
      selected: null
    },
    {
      title: "Face",
      column: 2,
      attribute: "face",
      selected: null
    },
    {
      title: "Boca",
      column: 1,
      attribute: "boca",
      selected: null
    },
    {
      title: "Armadura",
      column: 2,
      attribute: "armadura",
      selected: null
    },
    {
      title: "Mão Dominante",
      column: 1,
      attribute: "mao_dominante",
      selected: null
    },
    {
      title: "Mão Secundária",
      column: 2,
      attribute: "mao_secundaria",
      selected: null
    },
    {
      title: "Capa",
      column: 1,
      attribute: "capa",
      selected: null
    },
    {
      title: "Calçado",
      column: 2,
      attribute: "calcado",
      selected: null
    },
    {
      title: "Acessório 1",
      column: 1,
      attribute: "acessorio",
      selected: null
    },
    {
      title: "Acessório 2",
      column: 2,
      attribute: "acessorio",
      selected: null
    },
    {
      title: "Fantasia",
      column: 1,
      attribute: "fantasia",
      selected: null
    },
    {
      title: "Costas",
      column: 2,
      attribute: "costas",
      selected: null
    },
  ];

  mvp: MVP | null = null;

  constructor(private requestApiService: RequestApiService) {
  }

  ngOnInit() {
    this.getListMvps();
  }

  applyFilterBelt(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCardBelt.filter = filterValue.trim().toLowerCase();
  }


  getUrlCard(cardName: string, equipment: string) {

    cardName = cardName.replace(' (Nv. 5/10/15)', '');
    cardName = cardName.replace(' (Nv. 15)', '');
    cardName = cardName.replace(' (Nv. 5/10)', '');
    cardName = cardName.replace(' (Empérium)', '');

    return `http://localhost:3000/card/image/${equipment}/${cardName}.png`;
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  renderMvp(event: any) {
    console.log('Event', event);
    this.mvp = event;
    this.addCardImagesToMvp();

  }

  async getListMvps() {
    await this.requestApiService.getMvps().then((data) => {
      this.dataSource = data;
    });
  }

  addCardImagesToMvp() {
    if (this.mvp) {
      const cardRequests: Observable<any>[] = [];

      Object.keys(this.mvp.recommended_cards).forEach(equip => {
        if (this.mvp) {
          this.mvp.recommended_cards[equip].forEach((option: any) => {
            option.cards.forEach((card: any) => {
              cardRequests.push(
                this.requestApiService.getImageCard(card).pipe(
                  map(imageUrl => ({ card, imageUrl }))
                )
              );
            });
          });
        }

      });

      forkJoin(cardRequests).subscribe(results => {
        results.forEach(result => {
          if (this.mvp) {
            Object.keys(this.mvp.recommended_cards).forEach(equip => {
              if (this.mvp) {
                this.mvp.recommended_cards[equip].forEach((option: any) => {
                  option.cards.forEach((card: any) => {
                    if (card === result.card) {
                      card.imageUrl = result.imageUrl;
                    }
                  });
                });
              }
            });
          }

        });
      });
    }

    console.log('MVP', this.mvp);
  }

  protected readonly Number = Number;
}
