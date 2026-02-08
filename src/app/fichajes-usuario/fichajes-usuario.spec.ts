import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichajesUsuario } from './fichajes-usuario';

describe('FichajesUsuario', () => {
  let component: FichajesUsuario;
  let fixture: ComponentFixture<FichajesUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichajesUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichajesUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
