import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  //Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  constructor( private fb: FormBuilder,
               private paisesService: PaisesServiceService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambia la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( (_) => { this.miFormulario.get('pais')?.reset('')}),
        switchMap( region => this.paisesService.getPaisesPorRegion(region) )
      ).subscribe( paises => {
        this.paises = paises
      });

    //cuando cambia la pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( (_) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo))
      ).subscribe( pais => {
        this.fronteras = pais?.borders || [];
      });

  }

  guardar(): void{
    console.log(this.miFormulario.value);
  }

}
