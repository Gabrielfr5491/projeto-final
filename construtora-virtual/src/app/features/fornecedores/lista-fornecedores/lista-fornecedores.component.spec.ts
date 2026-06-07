import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFornecedoresComponent } from './lista-fornecedores.component';

describe('ListaFornecedoresComponent', () => {
  let component: ListaFornecedoresComponent;
  let fixture: ComponentFixture<ListaFornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaFornecedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaFornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
