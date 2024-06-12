    import {
      Component,
      ElementRef,
      OnInit,
      Renderer2,
      ViewChild,
    } from '@angular/core';
    import { RouterOutlet, Router } from '@angular/router';
    import { AsyncPipe, CommonModule } from '@angular/common';
    import { HttpClientModule } from '@angular/common/http';
    import { FormsModule } from '@angular/forms';
    import { UserService } from './core/services/user.service';
    import { APIResponseModel, IProduct, IUser, Login, Register } from './core/model/Models';
    import { CartService } from './core/services/cart.service';
    import { CartItemCountService } from './core/services/cart-item-count.service';
    import { ProductComponent } from './pages/product/product.component';
    import { FooterComponent } from './footer/footer.component';
    import { CarouselComponent } from './carousel/carousel.component';
    import { ProductService } from './core/services/product.service';
    import { IonicModule } from '@ionic/angular';
    declare var bootstrap: any; // Declaración para que TypeScript no arroje un error

    @Component({
      selector: 'app-root',
      standalone: true,
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'],
      imports: [
        RouterOutlet,
        HttpClientModule,
        CommonModule,
        AsyncPipe,
        FormsModule,
        ProductComponent,
        FooterComponent,
        CarouselComponent,
        IonicModule,
      ],
    })

    export class AppComponent implements OnInit {
      title = 'eCommerce';
      registerObj: Register = new Register();
      confirmPassword: string = '';
      passwordMismatch: boolean = false;
      loginObj: Login = new Login();
      loggedUSerData: IUser | null = null;
      productosConOferta: IProduct[] = [];
      productosSinOferta: IProduct[] = [];

      cartItemCount: number = 0;
      loginErrorMessage: string | null = null;
      

      constructor(
        private userService: UserService,
        private cartService: CartService,
        private cartItemCountService: CartItemCountService,
        private productService: ProductService,
        private renderer: Renderer2
      ) {
        const userData = sessionStorage.getItem('userData');
        this.loggedUSerData = userData ? JSON.parse(userData) : null;
      }

      anioActual: number | undefined;
      fechaActual: String | undefined;
      ngOnInit(): void {
        this.anioActual = new Date().getFullYear();
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
        //Al utilizar as const en el objeto de opciones, estás indicando a TypeScript que las
        //propiedades son del tipo específico requerido por toLocaleDateString, que es "numeric", "2-digit" o undefined
        this.fechaActual = currentDate.toLocaleDateString(undefined, options);

        if (this.loggedUSerData) {
          const userId = this.loggedUSerData.id;
          this.cartService.getCartItemCount().subscribe(
            (response: any) => {
              const totalProducts = response.totalProducts;
              this.cartItemCount = totalProducts;
            },
            (error) => {
              console.error('Error getting total products in cart:', error);
            }
          );
        }
        this.cartItemCountService.cartItemCount$.subscribe((count: number) => {
          this.cartItemCount = count;
        });
        
      }


      onLogin() {
        this.userService.loginUser(this.loginObj).subscribe(
          (res: any) => {
            if (res.id >= 0) {
              this.loggedUSerData = res;
              sessionStorage.setItem('userData', JSON.stringify(res));
              this.cartService.getCartItemCount().subscribe((response: any) => {
                const totalProducts = response.totalProducts;
                this.cartItemCountService.updateCartItemCount(totalProducts);
              });
              location.reload();
            } else {
              this.loginErrorMessage = res.message;
            }
          },
          (error) => {
            if (error.status === 401) {
              this.loginErrorMessage = 'Correo o contraseña incorrectos';
            } else {
              this.loginErrorMessage = 'Ocurrió un error. Por favor, intenta nuevamente.';
            }
          }
        );
      }

      onRegister() {
        if (this.registerObj.password !== this.confirmPassword) {
          this.passwordMismatch = true;
        } else {
          this.passwordMismatch = false;
          this.userService.registerUser(this.registerObj).subscribe((res: any) => {
            if (res.id >= 0) {
              alert('Usuario Registrado Correctamente');
              location.reload();
            } else {
              alert(res.message);
            }
          });
        }
      }

      onLogout() {
        this.loggedUSerData = null;
        sessionStorage.removeItem('userData');
        this.cartItemCountService.updateCartItemCount(0); // Resetear el contador a 0 al cerrar sesión
        alert('Sesión cerrada');
      }

      @ViewChild('tooltipTrigger') tooltipTrigger!: ElementRef;
      ngAfterViewInit() {
        // Obtener el elemento que desencadena el tooltip
        //Usamos ViewChild para obtener una referencia al elemento que deseamos activar con Bootstrap.
        const tooltipTriggerEl = this.tooltipTrigger.nativeElement;
        // Crear el tooltip
        //En el método ngAfterViewInit, utiliza Renderer2 para agregar el tooltip a dicho elemento.
        const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
      }
      @ViewChild('toast') toastEl: ElementRef | undefined;
      mostrarToast(): void {
        if (this.toastEl) {
          const toast = new bootstrap.Toast(this.toastEl.nativeElement);
          toast.show();
        }
      }
      @ViewChild('toastBtnInu') toastBtnInu!: ElementRef; //Con esto traemos la referencia del elemento #toastBtnInu
      mostrarToastBtnInu() {
        const toast = new bootstrap.Toast(this.toastBtnInu.nativeElement);
        toast.show();
      }
    }
