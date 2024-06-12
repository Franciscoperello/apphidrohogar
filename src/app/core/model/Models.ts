export class IUser {
    id: number;
    name: string;
    email: string;
    address: string;
    password: string;
    admin: boolean;
    constructor(){
        this.id=0,
        this.name="",
        this.email="",
        this.address="",
        this.password="",
        this.admin=false
    }
}

export interface ICategory {
    nombre: string
}

export class CProduct {
    nombre: string
    descripcion: string
    caracteristicas: string
    categoria: string
    precio: number
    precioOferta: number
    imgSrc: string
    constructor(){
        this.nombre='',
        this.descripcion='',
        this.caracteristicas='',
        this.categoria='',
        this.precio=0,
        this.precioOferta=0,
        this.imgSrc=''
    }
}

export interface IProduct {
    id: number
    nombre: string
    descripcion: string
    caracteristicas: string
    categoria: string
    precio: number
    precioOferta: number
    imgSrc: string
}

export class Login {
    email: string;
    password: string;
    constructor(){
      this.email='';
      this.password='';
    }
}

export interface OrderItem {
    productId: number;
    quantity: number;
    productInfo?: CProduct;
}
export interface Order {
    userId: number;
    name: string;
    address: string;
    phone: string;
    items: OrderItem[];
    orderDate: Date;
  }

export class Register {
    name: string;
    address: string;
    email: string;
    password: string;
    admin: boolean;
    constructor(){
        this.name='',
        this.address='',
        this.email='',
        this.password='',
        this.admin=false
    }
}

export interface CartItem {
    productId: number;
    quantity: number;
}
  
export interface Cart {
    userId: number;
    items: CartItem[];
}
  
export interface APIResponseModel {
    data: any;
}