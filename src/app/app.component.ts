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
import {MatTableModule} from "@angular/material/table";
import {map, startWith} from "rxjs/operators";
import {RequestApiService} from "./services/request-api.service";
import {MatDivider} from "@angular/material/divider";

export interface ExampleTab {
  label: string;
  content: string;
}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];

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
    MatDivider
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
  expandedElement: PeriodicElement | null | undefined;

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
