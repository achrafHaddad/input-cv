import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { Component, ViewChild, ElementRef } from '@angular/core';
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
export class AppComponent {
  title = 'cv';

  newExp = new FormGroup ({
    
    post: new FormControl('', [Validators.required]),
    societe: new FormControl('', [Validators.required]),
    dateDebut: new FormControl('', [Validators.required]),
    dateFin: new FormControl('', [Validators.required])
  })


  angFormInfo = new FormGroup({
    presonalInfo: new FormGroup({

      nom: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[a-zA-Z]+$")]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern("^[a-zA-Z]+$")]),
      email: new FormControl('', [Validators.required, Validators.email]),
      tel: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8),
        Validators.pattern("^[0-9]$")]),
      adresse: new FormControl('', [Validators.required, Validators.minLength(4)]),
    }),
    exps: new FormArray([this.newExp]),
    skills: new FormArray([])  
  });

  
  


  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  

  get exps(): FormArray {
    return this.angFormInfo.get('exps') as FormArray;
  }
  onFormSubmit(): void {
    
      console.log(this.angFormInfo.value);
    
  }
  addNameField() {
    this.exps.push(this.newExp);
  }

  deleteNameField(index: number) {
    if (this.exps.length !== 1) {
      this.exps.removeAt(index);
    }
    console.log(this.exps.length);
  }

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  filteredskills: Observable<string[]>;
  skills: string[] = ['HTML'];
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
      this.skills.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.skillCtrl.setValue(null);
  }

  remove(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allskills.filter(skill => skill.toLowerCase().indexOf(filterValue) === 0);
  }

}
