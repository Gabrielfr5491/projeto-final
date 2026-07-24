# Projeto Final — Sistema de Gestão de Construtora

Sistema full-stack para gestão de obras, custos, materiais, equipamentos, fornecedores e funcionários de uma construtora. Inclui autenticação JWT, diário de obra, alertas automáticos, relatórios e um dashboard com curva de EVM (Earned Value Management).

O projeto é um monorepo dividido em duas aplicações independentes:

```
projeto-final/
├── construtora-api/       # Backend — NestJS + TypeORM + PostgreSQL
└── construtora-virtual/   # Frontend — Angular 19
```

## Stack

**Backend (`construtora-api`)**
- [NestJS 11](https://nestjs.com/)
- [TypeORM](https://typeorm.io/) + PostgreSQL
- Autenticação JWT (`@nestjs/jwt`, `passport-jwt`) com hash de senha via `bcrypt`
- Validação com `class-validator` / `class-transformer`
- Deploy: [Render](https://render.com/)
- Banco de dados: [Supabase](https://supabase.com/) (Postgres, via connection pooling/pgbouncer)

**Frontend (`construtora-virtual`)**
- [Angular 19](https://angular.dev/)
- [ApexCharts](https://apexcharts.com/) (via `ng-apexcharts`) para gráficos do dashboard
- [Three.js](https://threejs.org/) para visualização de modelos 3D
- [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/) e [AOS](https://michalsnik.github.io/aos/) para animações e scroll
- [Bootstrap 5](https://getbootstrap.com/) + Bootstrap Icons
- [Leaflet](https://leafletjs.com/) para mapas
- Deploy: [Vercel](https://vercel.com/)

## Módulos do sistema

| Módulo | Descrição |
|---|---|
| `auth` | Login e autenticação via JWT |
| `usuarios` | Gestão de usuários e permissões |
| `obras` | Cadastro e acompanhamento de obras |
| `custos` | Lançamento e controle de custos |
| `materiais` | Controle de estoque de materiais |
| `equipamentos` | Gestão de equipamentos da obra |
| `fornecedores` | Cadastro de fornecedores |
| `funcionarios` | Gestão de funcionários alocados nas obras |
| `diario` | Diário de obra (registros diários) |
| `alertas` | Alertas automáticos (prazos, custos, estoque) |
| `relatorios` | Geração de relatórios |
| `dashboard` | Indicadores gerenciais e curva de EVM |
| `modelo3d` | Integração com modelos 3D das obras |

## Pré-requisitos

- Node.js 20+
- npm
- Uma instância PostgreSQL (local ou Supabase)

## Como rodar localmente

### 1. Backend (`construtora-api`)

```bash
cd construtora-api
npm install
```

Crie um arquivo `.env` na raiz de `construtora-api` com:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
PORT=3000
```

> A conexão usa `ssl: { rejectUnauthorized: false }` e `synchronize: true`, então o schema é sincronizado automaticamente com as entidades do TypeORM ao subir a aplicação — não é necessário rodar migrations manualmente em desenvolvimento.

```bash
npm run start:dev
```

A API sobe em `http://localhost:3000`.

Outros comandos úteis:

```bash
npm run test       # testes unitários
npm run test:e2e   # testes end-to-end
npm run test:cov   # cobertura de testes
npm run lint        # lint com correção automática
```

### 2. Frontend (`construtora-virtual`)

```bash
cd construtora-virtual
npm install
npm start   # ng serve
```

A aplicação sobe em `http://localhost:4200`.

> O frontend aponta por padrão para a API já publicada no Render. Se quiser apontar para a API local, ajuste a URL base usada pelos serviços em `src/app/core/services` (ex.: `auth.service.ts`) para `http://localhost:3000`.

## Deploy

| Camada | Serviço |
|---|---|
| API (NestJS) | Render |
| Banco de dados | Supabase (PostgreSQL) |
| Frontend (Angular) | Vercel |

O CORS da API já está configurado para aceitar requisições do frontend em produção, além de `localhost` em qualquer porta durante o desenvolvimento (ver `construtora-api/src/main.ts`).

## Design do frontend

O dashboard segue um tema dark, com paleta:

- Laranja: `#FF6B1A`
- Quase-preto: `#0D0D0D`
- Off-white: `#FAFAF7`

O tema é controlado pelo `ThemeService`, permitindo alternância entre modos.

## Estrutura de pastas (frontend)

```
src/app/
├── core/
│   ├── guards/       # auth, admin, role
│   ├── interceptors/
│   └── services/     # um serviço por módulo (obras, custos, materiais, ...)
├── features/         # uma pasta por módulo/tela (dashboard, obras, auth, landing, ...)
├── models/
└── shared/
    ├── components/   # navbar, sidebar, toast
    └── layouts/      # dashboard-layout
```

## Licença

Projeto acadêmico/pessoal — sem licença definida.
