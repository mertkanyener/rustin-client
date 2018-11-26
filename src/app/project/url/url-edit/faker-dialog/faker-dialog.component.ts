import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface DialogData{
  choice: string;
}

export interface Category {
  name: string;
  subCategories : string[];
}

const TABLE_DATA : Category[] = [
  { name: "Address", subCategories: ["Street name", "Zip code", "City", "Country", "State", "Full Address"] },
  { name: "Ancient", subCategories: ["God", "Primordial", "Titan", "Hero"] },
  { name: "App", subCategories: ["Name", "Version", "Author"] },
  { name: "Artist", subCategories: ["Name"] },
  { name: "Beer", subCategories: ["Name", "Style", "Hop", "Yeast", "Malt"] },
  { name: "Book", subCategories: ["Author", "Title", "Publisher", "Genre"] },
  { name: "Cat", subCategories: ["Name", "Breed", "Registry"] },
  { name: "Color", subCategories: ["Name"] },
  { name: "Commerce", subCategories: ["Department", "Product Name", "Material", "Price", "Promotion Code"] },
  { name: "Company", subCategories: ["Name", "Industry", "Profession"] },
  { name: "Currency", subCategories: ["Name", "Code"] },
  { name: "Demographic", subCategories: ["Race", "Demonym", "Sex", "Marital Status"] },
  { name: "Dog", subCategories: ["Name", "Breed", "Sound", "Age", "Coat Length", "Gender", "Size"] },
  { name: "Dragon Ball", subCategories: ["Character"] },
  { name: "Educator", subCategories: ["University", "Course", "Secondary School", "Campus"] },
  { name: "Esports", subCategories: ["Player", "Team", "Event", "League", "Game"] },
  { name: "Finance", subCategories: ["Credit Card", "IBAN"] },
  { name: "Food", subCategories: ["Ingredient", "Spice"]},
  { name: "Friends", subCategories: ["Character", "Location", "Quote"] },
  { name: "Game of Thrones", subCategories: ["Character", "City", "Dragon" , "House" , "Quote" ] },
  { name: "Harry Potter", subCategories: ["Book", "Character", "Location", "Quote"] },
  { name: "Hobbit", subCategories: ["Character", "Location", "Quote", "Thorin's Company"] },
  { name: "How I Met Your Mother", subCategories: ["Character", "Quote"] },
  { name: "Internet", subCategories: ["E-Mail Address", "Domain Name", "Url", "Password"] },
  { name: "Job", subCategories: ["Field", "Seniority", "Position", "Key Skills", "Title"] },
  { name: "League of Legends", subCategories: ["Champion", "Summoner Spell", "Rank", "Location", "Quote"] },
  { name: "Lord of the Rings", subCategories: ["Character", "Location"] },
  { name: "Music", subCategories: ["Chord", "Instrument", "Key"] },
  { name: "Name", subCategories: ["Full Name", "First Name", "Last Name", "Name with middle"] },
  { name: "Phone Number", subCategories: ["Cell Phone", "Phone Number"] },
  { name: "Pokemon", subCategories: ["Name", "Location"] },
  { name: "Rock Band", subCategories: ["Name"] },
  { name: "Space", subCategories: ["Agency", "Agency Abbreviation" , "Company", "Consteallation", 
  "Distance Measurement", "Galaxy", "Meteorite", "Moon", "NASA Spacecraft",  "Nebula", "Planet", "Star", "Star Cluster"] },
  { name: "Star Trek", subCategories: ["Character", "Location", "Specie", "Villain"] },
  { name: "Stock", subCategories: ["NSDQ Symbol", "NYSE Symbol"] },
  { name: "Superhero", subCategories: ["Descriptor", "Name", "Power", "Prefix", "Suffix"] },
  { name: "Team", subCategories: ["Creature", "Name", "Sport", "State"] },
  { name: "Weather", subCategories: ["Description", "Temperature Celsius", "Temperature Fahrenheit"] },
  { name: "Witcher", subCategories: ["Character", "Location", "Monster", "Quote" , "School"] }
];

@Component({
  selector: 'app-faker-dialog',
  templateUrl: './faker-dialog.component.html',
  styleUrls: ['./faker-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FakerDialogComponent implements OnInit {

  dataSource = new MatTableDataSource(TABLE_DATA);
  expandedCategory : Category;
  displayColumns = ['name'];
  result = '';

  constructor(
    public dialogRef: MatDialogRef<FakerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.dataSource.filterPredicate = this.tableFilter();
  }

  tableFilter() : (data: any, filter:string) => boolean {
    let filterFn = function (data, filter) {
      return data.name.toLowerCase().trim().indexOf(filter) !== -1;
    };
    return filterFn;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  onClick(category: string, subCategory: string) {
    this.result = (category + "." + subCategory).replace(/-/g,'').replace(/ /g, '').toLowerCase();
    this.data.choice = this.result;
  }

}
