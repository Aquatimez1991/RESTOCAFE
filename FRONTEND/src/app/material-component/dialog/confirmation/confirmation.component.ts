import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule]
})
export class ConfirmationComponent implements OnInit {
  @Output() onEmitStatusChange = new EventEmitter<void>();
  details: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  translateMessage(message: string): string {
    if (!message) return '';
  
    let action = '';
    let itemName = '';
    let itemType = '';
  
    const parts = message.split(' '); 
    if (parts.length >= 3) {
      action = parts[0]; 
      itemName = parts[1]; 
      itemType = parts[2]; 
    }
   
    const actions: { [key: string]: string } = {
      delete: 'eliminar',
      update: 'actualizar'
    };
  
    const types: { [key: string]: string } = {
      product: 'producto',
      category: 'categoría'
    };
  
    const translatedAction = actions[action] || action;
    const translatedType = types[itemType] || itemType;
  
    return `¿Estás segura de que quieres ${translatedAction} el ${translatedType} ${itemName}?`;
  }
  

  ngOnInit(): void {
    if (this.dialogData?.confirmation) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction(): void {
    this.onEmitStatusChange.emit();
  }
}
