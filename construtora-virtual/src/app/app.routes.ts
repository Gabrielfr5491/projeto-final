import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/dashboard/home/home.component';
import { ListaObrasComponent } from './features/obras/lista-obras/lista-obras.component';
import { CadastroObraComponent } from './features/obras/cadastro-obra/cadastro-obra.component';
import { ListaFuncionariosComponent } from './features/funcionarios/lista-funcionarios/lista-funcionarios.component';
import { ListaFornecedoresComponent } from './features/fornecedores/lista-fornecedores/lista-fornecedores.component';
import { ListaMateriaisComponent } from './features/materiais/lista-materiais/lista-materiais.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    
  path: 'dashboard',
  component: HomeComponent,
  canActivate: [authGuard]

  },

  {
    path: 'obras',
    component: ListaObrasComponent,
    canActivate: [authGuard]
  },

  {
    path: 'cadastro-obra',
    component: CadastroObraComponent
  },

  {
    path: 'funcionarios',
    component: ListaFuncionariosComponent
  },

  {
    path: 'fornecedores',
    component: ListaFornecedoresComponent
  },

  {
    path: 'materiais',
    component: ListaMateriaisComponent
  },
  {
  path: 'login',
  component: LoginComponent
  }
];