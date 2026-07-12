import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegistroComponent } from './features/auth/registro/registro.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { HomeComponent } from './features/dashboard/home/home.component';
import { ListaObrasComponent } from './features/obras/lista-obras/lista-obras.component';
import { CadastroObraComponent } from './features/obras/cadastro-obra/cadastro-obra.component';
import { EditarObraComponent } from './features/obras/editar-obra/editar-obra.component';
import { DetalheObraComponent } from './features/obras/detalhe-obra/detalhe-obra.component';
import { ListaFuncionariosComponent } from './features/funcionarios/lista-funcionarios/lista-funcionarios.component';
import { CadastroFuncionarioComponent } from './features/funcionarios/cadastro-funcionario/cadastro-funcionario.component';
import { EditarFuncionarioComponent } from './features/funcionarios/editar-funcionario/editar-funcionario.component';
import { ListaFornecedoresComponent } from './features/fornecedores/lista-fornecedores/lista-fornecedores.component';
import { CadastroFornecedorComponent } from './features/fornecedores/cadastro-fornecedor/cadastro-fornecedor.component';
import { EditarFornecedorComponent } from './features/fornecedores/editar-fornecedor/editar-fornecedor.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { ListaMateriaisComponent } from './features/materiais/lista-materiais/lista-materiais.component';
import { CadastroMaterialComponent } from './features/materiais/cadastro-material/cadastro-material.component';
import { EditarMaterialComponent } from './features/materiais/editar-material/editar-material.component';
import { ListaEquipamentosComponent } from './features/equipamentos/lista-equipamentos/lista-equipamentos.component';
import { CadastroEquipamentoComponent } from './features/equipamentos/cadastro-equipamento/cadastro-equipamento.component';
import { EditarEquipamentoComponent } from './features/equipamentos/editar-equipamento/editar-equipamento.component';
import { ListaCustosComponent } from './features/custos/lista-custos/lista-custos.component';
import { CadastroCustoComponent } from './features/custos/cadastro-custo/cadastro-custo.component';
import { EditarCustoComponent } from './features/custos/editar-custo/editar-custo.component';
import { CadastroUsuarioComponent } from './features/usuarios/cadastro-usuario/cadastro-usuario.component';
import { EditarUsuarioComponent } from './features/usuarios/editar-usuario/editar-usuario.component';
import { ListaUsuariosComponent } from './features/usuarios/lista-usuarios/lista-usuarios.component';
import { LandingComponent } from './features/landing/landing.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { Modelo3dComponent } from './features/modelo3d/modelo3d.component';
import { DiarioObraComponent } from './features/diario-obra/diario-obra.component';
import { RelatoriosComponent } from './features/relatorios/relatorios.component';
import { AlertasComponent } from './features/alertas/alertas.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard',       component: HomeComponent },
      { path: 'obras',           component: ListaObrasComponent },
      { path: 'detalhe-obra/:id', component: DetalheObraComponent },
      { path: 'diario-obra',     component: DiarioObraComponent },
      { path: 'alertas',         component: AlertasComponent },
      { path: 'modelo3d',        component: Modelo3dComponent },

      { path: 'funcionarios',  component: ListaFuncionariosComponent,  canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'fornecedores',  component: ListaFornecedoresComponent,  canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'materiais',     component: ListaMateriaisComponent,     canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'equipamentos',  component: ListaEquipamentosComponent,  canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'custos',        component: ListaCustosComponent,        canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'relatorios',    component: RelatoriosComponent,         canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },

      { path: 'cadastro-obra',           component: CadastroObraComponent,          canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'editar-obra/:id',         component: EditarObraComponent,            canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'cadastro-funcionario',    component: CadastroFuncionarioComponent,   canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'editar-funcionario/:id',  component: EditarFuncionarioComponent,     canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'cadastro-fornecedor',     component: CadastroFornecedorComponent,    canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'editar-fornecedor/:id',   component: EditarFornecedorComponent,      canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'cadastro-material',       component: CadastroMaterialComponent,      canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'editar-material/:id',     component: EditarMaterialComponent,        canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'cadastro-equipamento',    component: CadastroEquipamentoComponent,   canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'editar-equipamento/:id',  component: EditarEquipamentoComponent,     canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'cadastro-custo',          component: CadastroCustoComponent,         canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },
      { path: 'editar-custo/:id',        component: EditarCustoComponent,           canActivate: [roleGuard], data: { roles: ['admin', 'gerente'] } },

      { path: 'usuarios',          component: ListaUsuariosComponent,   canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: 'cadastro-usuario',  component: CadastroUsuarioComponent, canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: 'editar-usuario/:id', component: EditarUsuarioComponent,  canActivate: [roleGuard], data: { roles: ['admin'] } },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
