import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
})
export class ProductBoxComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined ;
  @Output() addToCart = new EventEmitter();

  exchangeRate: number | undefined;

  constructor(private http: HttpClient) {}

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

  onAddToCart(): void {
   this.addToCart.emit(this.product);
  }

  convertToINR(priceUSD: number): number {
    //console.log(this.exchangeRate);
    if (!this.exchangeRate) return priceUSD;
    return priceUSD * this.exchangeRate;
  }

}
