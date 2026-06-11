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
import { EditarFuncionarioComponent } from './features/funcionarios/editar-funcionario/editar-funcionario.component';
import { CadastroFornecedorComponent } from './features/fornecedores/cadastro-fornecedor/cadastro-fornecedor.component';
import { EditarFornecedorComponent } from './features/fornecedores/editar-fornecedor/editar-fornecedor.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  // 1. ROTA PÚBLICA (Fora do Painel)
  { path: 'login', component: LoginComponent },

  // 2. ROTAS PRIVADAS DO SISTEMA (Todas usam o mesmo Layout e o mesmo Guard)
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Ao acessar '/dashboard', abre a Home
      { path: 'dashboard', component: HomeComponent },

      // Módulo de Obras
      { path: 'obras', component: ListaObrasComponent },
      { path: 'cadastro-obra', component: CadastroObraComponent },

      // Módulo de Funcionários
      { path: 'funcionarios', component: ListaFuncionariosComponent },
      { path: 'cadastro-funcionario', component: CadastroFuncionarioComponent },
      { path: 'editar-funcionario/:id', component: EditarFuncionarioComponent },

      // Módulo de Fornecedores 🏗️
      { path: 'fornecedores', component: ListaFornecedoresComponent },
      { path: 'cadastro-fornecedor', component: CadastroFornecedorComponent },
      { path: 'editar-fornecedor/:id', component: EditarFornecedorComponent },

      // Módulo de Materiais
      { path: 'materiais', component: ListaMateriaisComponent },
    ]
  },

  // 3. REDIRECIONAMENTOS DE SEGURANÇA
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];