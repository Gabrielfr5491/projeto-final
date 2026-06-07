import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMateriaisComponent } from './lista-materiais.component';

describe('ListaMateriaisComponent', () => {
  let component: ListaMateriaisComponent;
  let fixture: ComponentFixture<ListaMateriaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMateriaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMateriaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
