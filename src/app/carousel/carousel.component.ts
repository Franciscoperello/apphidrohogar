import { Component, OnInit } from '@angular/core';
import { IProduct } from '../core/model/Models';
import { ProductService } from '../core/services/product.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

declare var bootstrap: any; // Declara Bootstrap para TypeScript

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  imports: [
    CommonModule, /*Necesario para el uso de: *ngFor="let producto of productosConOferta"*/
    RouterModule
  ],
})


export class CarouselComponent  implements OnInit  {
  productosConOferta: IProduct[] = [];
  productosSinOferta: IProduct[] = [];

  constructor(
    private productService: ProductService
  ){}

  ngOnInit() {
    
    let boton = document.getElementById('avanza');
    let btnAtr = document.getElementById("atras");
    if (boton) {
      boton.addEventListener('click', (ev) => {
        console.log('Me has clicado');
      });
    } else {
      console.error('El elemento con id "avanza" no se encontró')
    }

    if (btnAtr){
      btnAtr.addEventListener("click", ev =>{
        console.log("Has clicado para ir atrás");
      })
    }
    this.traeProducto();
  }

  traeProducto(){
    this.productService.getAllProduct().subscribe(
      (productos: IProduct[]) => {
        this.productosConOferta = productos.filter((producto: IProduct) => producto.precioOferta > 0);
        this.productosSinOferta = productos.filter((producto: IProduct) => producto.precioOferta === 0);
      },
      (error) => {
        console.error('Error getting products:', error);
      }
    );
  }
}
