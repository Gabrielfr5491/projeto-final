import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCustosComponent } from './lista-custos.component';

describe('ListaCustosComponent', () => {
  let component: ListaCustosComponent;
  let fixture: ComponentFixture<ListaCustosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCustosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCustosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
