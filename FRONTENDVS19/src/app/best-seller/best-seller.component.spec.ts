import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestSellerComponent } from './best-seller.component';
import { By } from '@angular/platform-browser';

describe('BestSellerComponent', () => {
  let component: BestSellerComponent;
  let fixture: ComponentFixture<BestSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BestSellerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render the correct number of best sellers', () => {
    const items = fixture.debugElement.queryAll(By.css('.timeline li'));
    expect(items.length).toEqual(component.bestSellers.length + 1); // +1 for the last "Be Part of Our Cafe" item
  });

  it('should display the correct names', () => {
    const nameElements = fixture.debugElement.queryAll(By.css('.timeline-heading h4'));
    nameElements.forEach((el, index) => {
      expect(el.nativeElement.textContent.trim()).toEqual(component.bestSellers[index].name);
    });
  });
});