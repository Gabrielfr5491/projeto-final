import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegistroComponent } from './features/auth/registro/registro.component';
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
import { ListaCustosComponent } from './features/custos/lista-custos/lista-custos.component';
import { CadastroCustoComponent } from './features/custos/cadastro-custo/cadastro-custo.component';
import { EditarCustoComponent } from './features/custos/editar-custo/editar-custo.component';
import { LandingComponent } from './features/landing/landing.component';
import { adminGuard } from './core/guards/admin.guard';
import { CadastroUsuarioComponent } from './features/usuarios/cadastro-usuario/cadastro-usuario.component';
import { ListaUsuariosComponent } from './features/usuarios/lista-usuarios/lista-usuarios.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { Modelo3dComponent } from './features/modelo3d/modelo3d.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'obras', component: ListaObrasComponent },
      { path: 'cadastro-obra', component: CadastroObraComponent },
      { path: 'funcionarios', component: ListaFuncionariosComponent },
      { path: 'cadastro-funcionario', component: CadastroFuncionarioComponent },
      { path: 'editar-funcionario/:id', component: EditarFuncionarioComponent },
      { path: 'fornecedores', component: ListaFornecedoresComponent },
      { path: 'cadastro-fornecedor', component: CadastroFornecedorComponent },
      { path: 'editar-fornecedor/:id', component: EditarFornecedorComponent },
      { path: 'materiais', component: ListaMateriaisComponent },
      { path: 'cadastro-material', component: CadastroMaterialComponent },
      { path: 'editar-material/:id', component: EditarMaterialComponent },
      { path: 'equipamentos', component: ListaEquipamentosComponent },
      { path: 'cadastro-equipamento', component: CadastroEquipamentoComponent },
      { path: 'editar-equipamento/:id', component: EditarEquipamentoComponent },
      { path: 'custos', component: ListaCustosComponent },
      { path: 'cadastro-custo', component: CadastroCustoComponent },
      { path: 'editar-custo/:id', component: EditarCustoComponent },
      { path: 'usuarios', component: ListaUsuariosComponent },
      { path: 'cadastro-usuario', component: CadastroUsuarioComponent, canActivate: [adminGuard] },
      { path: 'modelo3d', component: Modelo3dComponent },
    ]
  },

  { path: '**', component: NotFoundComponent }
];