import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Filters } from '../interfaces/Filter';
import { Product } from '../product/product.component';
import { ShopService } from '../shop.service';
import { FilterItems, GetItems } from '../store/actions';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {

  constructor(private shopService: ShopService, private store: Store<{ products: Product[]; cart: [], filtred: [] }>) {
    store.pipe(select('shop')).subscribe(data => { this.products = data.products; });
  }
  products: Product[] = [];
  filters: Filters[] = [
    { id: 1, options: ['Red', 'Blue', 'Green'], label: 'Color' },
    { id: 2, options: ['Men', 'Women'], label: 'Gender' },
    { id: 3, options: ['0-Rs250', 'Rs251-450', 'Rs450'], label: 'Price' },
    { id: 4, options: ['Polo', 'Hoodie', 'Basic'], label: 'Type' },
  ];
  filterCollection = {
    color: [],
    gender: [],
    type: [],
    price: [],
    gs: []//global search
  };
  ngOnInit() {
    // this.store.dispatch(new GetItems());
    const filterSub = this.shopService.searchWord.subscribe(res => {
      if (res === '') {
        this.filterCollection.gs = [];
        const query = this.buildFilter(this.filterCollection);
        const result = this.filterDataByTag(this.products, query);
        this.store.dispatch(new FilterItems(result));
        return;
      }
      else {
        this.filterCollection.gs.push(res);
        const query = this.buildFilter(this.filterCollection);
        const result = this.filterDataByTag(this.products, query);
        this.store.dispatch(new FilterItems(result));
        console.log('gs', result);
      }
      console.log(this.filterCollection);
    });
  }

  onFilter(event, label) {
    if (event.target.checked) {
      this.filterCollection[label.toLowerCase()].push(event.target.id);
    }
    else {
      const index = this.filterCollection[label.toLowerCase()].indexOf(event.target.id);
      if (index > -1) {
        this.filterCollection[label.toLowerCase()].splice(index, 1);
      }
    }
    const query = this.buildFilter(this.filterCollection);
    const result = this.filterDataByTag(this.products, query);
    console.log('side', result);
    this.store.dispatch(new FilterItems(result));
  }

  buildFilter = (filter) => {
    let query = {};
    for (let keys in filter) {
      if (filter[keys].constructor === Array && filter[keys].length > 0) {
        query[keys] = filter[keys];
      }
    }
    return query;
  }

  priceHelper = {
    '0-Rs250': [0, 250],
    'Rs251-450': [251, 450],
    'Rs450': [450, 1000],
  };

  filterDataByTag = (data, query) => {
    let filteredData = data.filter((item) => {
      for (let key in query) {
        let paraLen = query[key].length;
        let p1 = query[key][0];
        let p2 = query[key][1];
        let p3 = query[key][2];

        if (key === 'price') {
          if (paraLen === 1 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][1])) {
            return false;
          }
          else if (paraLen === 2 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][1]) && !(item[key] >= this.priceHelper[p2][0] && item[key] <= this.priceHelper[p2][1])) {
            return false;
          }
          else if (paraLen === 3 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][0]) && (item[key] >= this.priceHelper[p2][0] && item[key] <= this.priceHelper[p2][0]) && (item[key] >= this.priceHelper[p3][0] && item[key] <= this.priceHelper[p3][0])) {
            return false;
          }
        }

        if (key !== 'price' && key !== 'gs' && (item[key] === undefined || !query[key].includes(item[key]))) {
          return false;
        }

        if (key === 'gs' && item[key] === undefined && !(query[key].includes(item.name.toLowerCase()) || query[key].includes(item.type.toLowerCase()) || query[key].includes(item.color.toLowerCase()) || query[key].includes(item.gender.toLowerCase()) || Number(query[key])===(Number(item.price)))) {
         debugger
          return false;
        }

      }
      return true;
    });
    return filteredData;
  };

}

