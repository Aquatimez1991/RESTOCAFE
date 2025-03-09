import { Component } from '@angular/core';

interface BestSellerItem {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent {
  bestSellers: BestSellerItem[] = [
    {
      name: 'Pizza',
      description: 'Pizza is an Italian dish consisting of a usually round...',
      image: 'assets/img/1.jpg'
    },
    {
      name: 'Biryani',
      description: 'Biryani is a mixed rice dish made with Indian spices...',
      image: 'assets/img/2.jpg'
    },
    {
      name: 'Pasta',
      description: 'Pasta is a type of food typically made from an unleavened dough...',
      image: 'assets/img/3.jpg'
    },
    {
      name: 'Molten Chocolate Cake',
      description: 'Molten chocolate cake combines elements of a chocolate cake...',
      image: 'assets/img/4.jpg'
    }
  ];
}
