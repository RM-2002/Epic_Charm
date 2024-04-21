import { Component, Input, OnInit } from '@angular/core';
import { MatMenuPanel } from '@angular/material/menu';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit{

  private _cart: Cart = { items: [] };
  itemsQuantity = 0;
  exchangeRate: number | undefined;


  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  //menu: MatMenuPanel<any> | null = null;

  constructor(private _cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchExchangeRate();
  }

  fetchExchangeRate() {
    // Replace 'YOUR_API_KEY' with your actual API key from Open Exchange Rates
   // const apiKey = 'YOUR_API_KEY';
    const url = `https://open.exchangerate-api.com/v6/latest/USD`;

    this.http.get<any>(url).subscribe(data => {
      this.exchangeRate = data.rates.INR;
    });
  }

  convertToINR(priceUSD: number): number {
    //console.log(this.exchangeRate);
    if (!this.exchangeRate) return priceUSD;
    return priceUSD * this.exchangeRate;
  }


  
  getTotal(items: CartItem[]): number {
    return this._cartService.getTotal(items);
  }

  onClearCart(): void {
    this._cartService.clearCart();
  }

}
