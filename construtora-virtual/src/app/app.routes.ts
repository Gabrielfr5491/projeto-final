import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/dashboard/home/home.component';
import { ListaObrasComponent } from './features/obras/lista-obras/lista-obras.component';
import { CadastroObraComponent } from './features/obras/cadastro-obra/cadastro-obra.component';
import { ListaFuncionariosComponent } from './features/funcionarios/lista-funcionarios/lista-funcionarios.component';
import { ListaFornecedoresComponent } from './features/fornecedores/lista-fornecedores/lista-fornecedores.component';
import { ListaMateriaisComponent } from './features/materiais/lista-materiais/lista-materiais.component';
import { CadastroFuncionarioComponent } from './features/funcionarios/cadastro-funcionario/cadastro-funcionario.component';

// IMPORTANTE: Importe o seu componente de Layout aqui
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  // 1. ROTA DE LOGIN: 100% isolada do resto do sistema
  {
    path: 'login',
    component: LoginComponent
  },

  // 2. ROTA DO DASHBOARD: Força o uso do Layout e coloca a Home dentro dele
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent }
    ]
  },

  // 3. ROTA DE OBRAS: Força o uso do Layout e coloca a Listagem dentro dele
  {
    path: 'obras',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ListaObrasComponent }
    ]
  },

  // 4. ROTA DE CADASTRO DE OBRA
  {
    path: 'cadastro-obra',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: CadastroObraComponent }
    ]
  },

  // 5. ROTA DE FUNCIONÁRIOS
  {
    path: 'funcionarios',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ListaFuncionariosComponent }
    ]
  },

  {
  path: 'cadastro-funcionario',
  component: DashboardLayoutComponent,
  canActivate: [authGuard],
  children: [
    {
      path: '',
      component: CadastroFuncionarioComponent
    }
  ]
},

  // 6. ROTA DE FORNECEDORES
  {
    path: 'fornecedores',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ListaFornecedoresComponent }
    ]
  },

  // 7. ROTA DE MATERIAIS
  {
    path: 'materiais',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ListaMateriaisComponent }
    ]
  },

  // Redirecionamentos padrão de segurança
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];