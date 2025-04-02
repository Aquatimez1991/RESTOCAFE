import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  role: string;
}

const MENUITEMS: Menu[] = [
  { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'dashboard', role: '' },
  { state: 'category', name: 'Manage Category', type: 'link', icon: 'category', role: 'admin' },
  { state: 'product', name: 'Manage Product', type: 'link', icon: 'inventory_2', role: 'admin' },
  { state: 'order', name: 'Manage Order', type: 'link', icon: 'shopping_cart', role: '' },
  { state: 'bill', name: 'View Bill', type: 'link', icon: 'backup_table', role: '' },
  { state: 'user', name: 'Manage User', type: 'link', icon: 'people', role: 'admin' }
];

@Injectable({
  providedIn: 'root' // Agregar esto para que Angular lo registre automáticamente
})
export class MenuItems {
  getMenuitems(): Menu[] {
    return MENUITEMS;
  }
}
