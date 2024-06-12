import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  anioActual: number | undefined;
  fechaActual: String | undefined;
  ngOnInit(): void {
    this.anioActual = new Date().getFullYear();
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    //Al utilizar as const en el objeto de opciones, estás indicando a TypeScript que las
    //propiedades son del tipo específico requerido por toLocaleDateString, que es "numeric", "2-digit" o undefined
    this.fechaActual = currentDate.toLocaleDateString(undefined, options);
  }
}
