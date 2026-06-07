import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroObraComponent } from './cadastro-obra.component';

describe('CadastroObraComponent', () => {
  let component: CadastroObraComponent;
  let fixture: ComponentFixture<CadastroObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
