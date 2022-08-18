import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Product } from '../product/product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  constructor() { }
  @Input() products: Product[] = [];
 
  ngOnInit() { }
}
