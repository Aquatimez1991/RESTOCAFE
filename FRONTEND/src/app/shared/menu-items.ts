import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  role: string;
}

const MENUITEMS: Menu[] = [
  { state: 'dashboard', name: 'Tablero', type: 'link', icon: 'dashboard', role: '' },
  { state: 'category', name: 'Gestionar Categoría', type: 'link', icon: 'category', role: 'admin' },
  { state: 'product', name: 'Gestionar Producto', type: 'link', icon: 'inventory_2', role: 'admin' },
  { state: 'order', name: 'Gestionar Pedido', type: 'link', icon: 'shopping_cart', role: '' },
  { state: 'bill', name: 'Ver Factura', type: 'link', icon: 'backup_table', role: '' },
  { state: 'user', name: 'Gestionar Usuario', type: 'link', icon: 'people', role: 'admin' }
];

@Injectable({
  providedIn: 'root' 
})
export class MenuItems {
  getMenuitems(): Menu[] {
    return MENUITEMS;
  }
}
