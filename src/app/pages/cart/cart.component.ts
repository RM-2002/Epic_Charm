import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit{
  cart: Cart = { items: [{
    id: 1,
    name: 'Product 1',
    price: 100,
    quantity: 1,
    product: 'https://via.placeholder.com/150'
  }] };

  exchangeRate: number | undefined;



  displayedColumns: string[] = [
    'product',
    'name',
    'price',
   'quantity',
    'total',
   'action',
  ];

  dataSource: Array<CartItem>= [];
  //cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) { }
  ngOnInit(): void {

    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = _cart.items;
    });

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
   return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onCheckout(): void {

    this.http
    .post('https://ecommerce-backend-zk8e.onrender.com/checkout', {
      items: this.cart.items,
    })
    .subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51OnowASExEf3OPyIZwb12hesQjd7QoaIGiCmdShcqoxTMSoEenwWJgEU5wFwCROxSLsZ3PmyCRV4w2dvHoNkaSN700uWDPRkYD');
      stripe?.redirectToCheckout({
        sessionId: res.id,
      });
    });
   
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }



}
