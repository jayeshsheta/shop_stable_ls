// import { Component, OnInit } from '@angular/core';
// import { select, Store } from '@ngrx/store';
// import { Filters } from '../interfaces/Filter';
// import { Product } from '../product/product.component';
// import { ShopService } from '../shop.service';
// import { FilterItems, GetItems } from '../store/actions';

// @Component({
//   selector: 'app-filter',
//   templateUrl: './filter.component.html',
//   styleUrls: ['./filter.component.scss']
// })

// export class FilterComponent implements OnInit {

//   constructor(private shopService: ShopService, private store: Store<{ items: Product[]; cart: [], filtred: [], hasFiltred: false }>) {
//     store.pipe(select('shop')).subscribe(data => { this.items = data.items; this.filtred = data.filtred, this.hasFiltred = data.hasFiltred });
//   }
//   items: Product[] = [];
//   filtred: Product[] = [];
//   hasFiltred: boolean = false;
//   filters: Filters[] = [
//     { id: 1, options: ['Red', 'Blue', 'Green'], label: 'Color', values: [false, false, false] },
//     { id: 2, options: ['Men', 'Women'], label: 'Gender', values: [false, false] },
//     { id: 3, options: ['0-Rs250', 'Rs251-450', 'Rs450'], label: 'Price', values: [false, false, false] },
//     { id: 4, options: ['Polo', 'Hoodie', 'Basic'], label: 'Type', values: [false, false, false] },
//   ];
//   filter = {
//     color: [],
//     gender: [],
//     type: [],
//     price: []
//   };
//   ngOnInit() {
//     this.store.dispatch(new GetItems());
//     // this.store.select('shop').subscribe(data => {
//     //   if (data.items) {
//     //   }
//     //   console.log('data', data);
//     // });
//     const filterSub = this.shopService.searchWord.subscribe(res => {
//       debugger
//       if (res === '') {
//         const query = this.buildFilter(this.filter);
//         const result = this.filterDataByTag(this.items, query);
//         this.store.dispatch(new FilterItems(result));

//         console.log(result);
//         return;
//       }
//       this.filterProducts(res);
//     })
//   }
//   filterProducts(term) {
//     if (term === '') {
//       const query = this.buildFilter(this.filter);
//       const result = this.filterDataByTag(this.items, query);
//       this.store.dispatch(new FilterItems(result));
//       return;
//     }
//     const combinedResult = [];
//     if (!this.items[0]) return;
//     const keys = ['name', 'type', 'price', 'color', 'gender'];
//     this.filtred.forEach(element => {
//       keys.forEach(key => {
//         if (element[key].toString().toLowerCase().includes(term.toString().toLocaleLowerCase())) {
//           if (this.filtred && !this.filtred.some(el => el.id === element.id))
//             this.filtred.push(element);
//           combinedResult.push(element)
//         }
//       });
//     });
//     console.log(this.filtred);
//     console.log(combinedResult);


//     this.store.dispatch(new FilterItems(combinedResult));
//     // this.updateFilterData();
//     return combinedResult;
//   }

//   checkFilterIsNull() {
//     return Object.values(this.filter).every(x => x.length === 0);
//   }
//   check(res) {
//     return res.length > 0;
//   }

//   onFilter(event, label) {
//     let trm = '';
//     this.shopService.searchWord.subscribe(res => { trm = res })
//     if (event.target.checked) {
//       this.filter[label.toLowerCase()].push(event.target.id);
//     }
//     else {
//       const index = this.filter[label.toLowerCase()].indexOf(event.target.id);
//       if (index > -1) {
//         this.filter[label.toLowerCase()].splice(index, 1);
//       }
//       if (this.checkFilterIsNull()) {
//         let trm = '';
//         this.shopService.searchWord.subscribe(res => { trm = res })
//         this.filterProducts(trm);
//         return;
//       }

//     }
//     const query = this.buildFilter(this.filter);
//     const result = this.filterDataByTag(this.filtred, query);

//     this.store.dispatch(new FilterItems(result));
//     // let data = this.updateFilterData();
//     //  console.log('d', data);

//   }

//   buildFilter = (filter) => {
//     let query = {};
//     for (let keys in filter) {
//       if (filter[keys].constructor === Array && filter[keys].length > 0) {
//         query[keys] = filter[keys];
//       }
//     }
//     return query;
//   }

//   priceHelper = {
//     '0-Rs250': [0, 250],
//     'Rs251-450': [251, 450],
//     'Rs450': [450, 1000],
//   };

//   filterDataByTag = (data, query, term = '') => {
//     let filteredData = data.filter((item) => {
//       for (let key in query) {

//         let paraLen = query[key].length;
//         let p1 = query[key][0];
//         let p2 = query[key][1];
//         let p3 = query[key][2];

//         if (key === 'price') {
//           if (paraLen === 1 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][1])) {
//             return false;
//           }
//           else if (paraLen === 2 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][1]) && !(item[key] >= this.priceHelper[p2][0] && item[key] <= this.priceHelper[p2][1])) {
//             return false;
//           }
//           else if (paraLen === 3 && !(item[key] > this.priceHelper[p1][0] && item[key] <= this.priceHelper[p1][0]) && (item[key] >= this.priceHelper[p2][0] && item[key] <= this.priceHelper[p2][0]) && (item[key] >= this.priceHelper[p3][0] && item[key] <= this.priceHelper[p3][0])) {
//             return false;
//           }
//         }

//         if (key !== 'price')
//           if (item[key] === undefined || !query[key].includes(item[key])) {
//             return false;
//           }
//       }
//       return true;
//     });

//     // if (this.checkFilterIsNull()) {
//     //   filteredData = this.filterProducts(term);
//     // }
//     return filteredData;
//   };


//   commonFiltre() {
//     let data = [];
//     let term = '';
//     this.shopService.searchWord.subscribe(res => { term = res });
//     if (this.checkFilterIsNull() || this.check(term)) {
//       data = this.items;
//     }
//     else {
//       data = this.filtred;
//     }
//     return data;
//   }

//   updateFilterData() {
//     let filteredData = [];

//     if (this.hasFiltred && (!this.checkFilterIsNull())) {
//       filteredData = this.filtred;
//     }
//     else {
//       filteredData = this.items;
//       let trm = '';
//       this.shopService.searchWord.subscribe(res => { trm = res });
//       this.filterProducts(trm);
//     }
//     return filteredData;
//     // this.store.dispatch(new FilterItems(filteredData));
//   }
// }




// // Case 1 select side filter then search filter
// //case 2 select search filter then side filter

// // one function at every filter click or everyKey stroke check both condition if bothnis there then use filtered else fresh one store in one global arr and assign in that filtered / fresh arr 

