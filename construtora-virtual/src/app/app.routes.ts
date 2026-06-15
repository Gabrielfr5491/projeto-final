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
import { CadastroMaterialComponent } from './features/materiais/cadastro-material/cadastro-material.component';
import { EditarMaterialComponent } from './features/materiais/editar-material/editar-material.component';
import { ListaEquipamentosComponent } from './features/equipamentos/lista-equipamentos/lista-equipamentos.component';
import { CadastroEquipamentoComponent } from './features/equipamentos/cadastro-equipamento/cadastro-equipamento.component';
import { EditarEquipamentoComponent } from './features/equipamentos/editar-equipamento/editar-equipamento.component';

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
      { path: 'cadastro-material', component: CadastroMaterialComponent },
      { path: 'editar-material/:id', component: EditarMaterialComponent },
      
      // Módulo de Equipamentos
      {path: 'equipamentos',component: ListaEquipamentosComponent},
      {path: 'cadastro-equipamento',component: CadastroEquipamentoComponent},
      {path: 'editar-equipamento/:id',component: EditarEquipamentoComponent},
    ]
  },

  // 3. REDIRECIONAMENTOS DE SEGURANÇA
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];