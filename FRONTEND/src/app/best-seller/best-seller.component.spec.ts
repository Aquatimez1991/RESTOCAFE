import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BestSellerComponent } from './best-seller.component';

describe('BestSellerComponent', () => {
  let component: BestSellerComponent;
  let fixture: ComponentFixture<BestSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, BestSellerComponent] // Importa el componente aquí
    }).compileComponents();

    fixture = TestBed.createComponent(BestSellerComponent);
    component = fixture.componentInstance;
    component.bestSellers = [
      { name: 'Pizza', description: 'Pizza is an Italian dish...', image: 'assets/img/1.jpg' },
      { name: 'Biryani', description: 'Biryani is a mixed rice dish...', image: 'assets/img/2.jpg' },
      { name: 'Pasta', description: 'Pasta is a type of food...', image: 'assets/img/3.jpg' },
      { name: 'Molten Chocolate Cake', description: 'Molten chocolate cake...', image: 'assets/img/4.jpg' }
    ];
    fixture.detectChanges(); // Asegúrate de llamar a detectChanges() después de inicializar bestSellers
  });

  it('should render the correct number of best sellers', () => {
    const items = fixture.debugElement.queryAll(By.css('.timeline li'));
    expect(items.length).toEqual(component.bestSellers.length + 1); // +1 for the last "Be Part of Our Cafe" item
  });

  it('should display the correct names', () => {
    const compiled = fixture.nativeElement;
    const itemNames = Array.from(compiled.querySelectorAll('.timeline li h4')) as HTMLElement[];
    let count = 0;

    for (let i = 0; i < itemNames.length; i++) {
      const itemName: string = itemNames[i].textContent?.trim() || ''; // Proporcionar un valor predeterminado
      if (itemName && component.bestSellers.some(seller => seller.name === itemName)) {
        count++;
        expect(itemName).toContain(component.bestSellers[i].name);
      }
    }

    expect(count).toBe(component.bestSellers.length);
  });
});
