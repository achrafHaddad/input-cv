import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cv';

  angFormInfo: FormGroup;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  
  get allExps(): FormArray {
    return this.angFormInfo.get('exps') as FormArray;
  }
  get getSkills() {
    return this.angFormInfo.get('skills') as FormArray;
  }
  onFormSubmit(): void {
    
      console.log(this.angFormInfo.value);
  }
  newExp(): FormGroup {
   return  new FormGroup ({
    
      post: new FormControl('', [Validators.required]),
      societe: new FormControl('', [Validators.required]),
      dateDebut: new FormControl('', [Validators.required]),
      dateFin: new FormControl('', [Validators.required])// zidni condition fel html mouch lenna elli date fin dima akber mel date debut
    })
  }
  addNameField() {
    this.allExps.push(this.newExp());
  }

  deleteNameField(index: number) {
    if (this.allExps.length !== 1) {
      this.allExps.removeAt(index);
    }
    console.log(this.allExps.length);
  }

  ngOnInit(): void {
    this.angFormInfo = new FormGroup({
      presonalInfo: new FormGroup({
  
        nom: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[a-zA-Z]+$")]),
        prenom: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[a-zA-Z]+$")]),
        email: new FormControl('', [Validators.required, Validators.email]),
        tel: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8),
          Validators.pattern("^[0-9]$")]),
        adresse: new FormControl('', [Validators.required, Validators.minLength(4)]),
      }),
      exps: new FormArray([this.newExp()]),
      skills: new FormArray([])  
    });
  }


  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  filteredskills: Observable<string[]>;
  allskills: string[] = ['HTML', 'CSS', 'Javascript', 'Angular', 'MangoDB', 'Java'];

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredskills = this.skillCtrl.valueChanges.pipe(
        startWith(null),
        map((skill: string | null) => skill ? this._filter(skill) : this.allskills.slice()));
  }

  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our skill
    if ((value || '').trim()) {
      this.getSkills.push(new FormControl(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.skillCtrl.setValue(null);
  }

  remove(i): void {
    if (i >= 0) {
      this.getSkills.removeAt(i);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.getSkills.push(new FormControl(event.option.viewValue));
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allskills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }

}
