import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LOCALE_ID, NgModule } from '@angular/core'; //LOCALE_ID para importar fecha esapñola
import { CartComponent } from './pages/cart/cart.component';
import { CarouselComponent } from './carousel/carousel.component';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { AdminProductComponent } from './pages/admin-product/admin-product.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { IonicModule } from '@ionic/angular';
import localeEs from '@angular/common/locales/es'; //Necesario para importar fecha esapñola
import { registerLocaleData } from '@angular/common';//Necesario para importar fecha esapñola

// Registra la localización española
registerLocaleData(localeEs, 'es');

export const routes: Routes = [
    {
        path:'',
        /*
        redirectTo:'home',
        pathMatch:'full',
        */
        component: CarouselComponent
    },
    {
        path:'products',
        component: ProductComponent
    },
    { 
        path: 'products/:id', 
        component: ProductDetailComponent 
    },
    { 
        path: 'cart', 
        component: CartComponent 
    },
    { 
        path: 'order-form', 
        component: OrderFormComponent 
    },
    { 
        path: 'order-history', 
        component: OrderHistoryComponent 
    },
    { 
        path: 'admin-product', 
        component: AdminProductComponent 
    },
    { 
        path: 'create-product', 
        component: CreateProductComponent 
    },
    { 
        path: 'edit-product/:id', 
        component: EditProductComponent 
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes),],
    providers: [
        { provide: LOCALE_ID, useValue: 'es' } // Configura Angular para usar español
    ],
    exports: [RouterModule]
  })

  export class AppRoutingModule { }
