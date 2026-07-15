# 🔧 Troubleshooting - Menu Hambúrguer Mobile

## ❌ Problema: Botão não funciona ao clicar

### 🧪 Como Testar

1. **Abra o Console do Navegador**
   ```
   F12 → Console tab
   ```

2. **Ative o DevTools Mobile**
   ```
   Ctrl+Shift+M (ou Cmd+Shift+M no Mac)
   Escolha: iPhone 12 Pro (390x844)
   ```

3. **Clique no Menu Hambúrguer**
   - Você deve ver no console:
   ```
   ✅ NavbarComponent initialized with LayoutService: true
   🍔 Botão hambúrguer clicado!
   Layout service exists? true
   🍔 Toggle Mobile Sidebar: true
   📱 Set Mobile Sidebar: true
   ```

### ✅ Se aparecerem os logs:

**O botão ESTÁ funcionando!** O problema pode ser visual (CSS).

**Verifique:**
1. A sidebar tem a classe `.mobile-open`?
2. O z-index está correto? (sidebar: 1050, backdrop: 1049)
3. A sidebar está usando `transform: translateX(0)` quando aberta?

**Inspeção Visual:**
- Abra DevTools → Elements
- Procure por `<aside class="sidebar mobile-open">`
- Se tem `.mobile-open` → CSS está incorreto
- Se NÃO tem `.mobile-open` → Service não está aplicando a classe

---

### ❌ Se NÃO aparecerem os logs:

**O evento click não está sendo disparado.**

**Possíveis causas:**

1. **Z-index sobreposto**
   - Outro elemento está cobrindo o botão
   - Solução: Verifique z-index da navbar (deve ser 999)

2. **Pointer-events: none**
   - CSS desabilitou o clique
   - Solução: Verifique o CSS do botão

3. **Display: none persistente**
   - Botão não está renderizado
   - Solução: Force `display: flex !important` em mobile

4. **Angular não compilou**
   - Componente não foi recarregado
   - Solução: `Ctrl+C` no terminal e `npm start` novamente

---

## 🔍 Diagnóstico Passo-a-Passo

### 1. Verifique se o botão está visível

```scss
// Deve estar no navbar.component.scss
@media (max-width: 768px) {
  .navbar-custom__hamburger { 
    display: flex !important;
  }
}
```

### 2. Verifique se o LayoutService está injetado

```typescript
// No console, após carregar a página:
// Você deve ver:
✅ NavbarComponent initialized with LayoutService: true
```

Se ver `false` → O service não foi injetado corretamente

### 3. Verifique o HTML do botão

```html
<!-- Deve ter (click)="toggleMenu()" -->
<button type="button" 
        class="navbar-custom__hamburger" 
        (click)="toggleMenu()" 
        aria-label="Menu Lateral">
```

### 4. Verifique a classe mobileSidebarOpen$

```typescript
// No dashboard-layout.component.html
[class.mobile-sidebar-open]="layout.mobileSidebarOpen$ | async"
```

### 5. Verifique a sidebar tem a classe correta

```html
<!-- sidebar.component.html -->
<aside class="sidebar" 
       [class.mobile-open]="layout.mobileSidebarOpen$ | async">
```

---

## 🛠️ Correções Rápidas

### Correção 1: Forçar display do botão

```scss
.navbar-custom__hamburger {
  @media (max-width: 768px) {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
}
```

### Correção 2: Adicionar console.log no HTML (teste)

```html
<button (click)="toggleMenu(); $event.stopPropagation()">
```

### Correção 3: Z-index absoluto

```scss
.navbar-custom {
  z-index: 9999 !important;
  
  &__hamburger {
    z-index: 10000 !important;
  }
}
```

### Correção 4: Simplificar o método

```typescript
// navbar.component.ts
toggleMenu() {
  alert('Clicou!'); // Se aparecer alert, evento funciona
  this.layout?.toggleMobileSidebar();
}
```

---

## 🚨 Casos Específicos

### Caso 1: Botão aparece mas não clica

**Sintoma:** Vejo o botão, mas nada acontece ao clicar

**Diagnóstico:**
1. Inspecione elemento
2. Verifique `pointer-events` (deve ser `auto`)
3. Verifique se há elemento sobreposto

**Solução:**
```scss
.navbar-custom__hamburger {
  position: relative;
  z-index: 10;
  pointer-events: auto !important;
}
```

### Caso 2: Botão não aparece em mobile

**Sintoma:** Em desktop funciona, mas não vejo em mobile

**Diagnóstico:**
1. Abra DevTools → Elements
2. Procure `.navbar-custom__hamburger`
3. Veja computed styles

**Solução:**
```scss
@media (max-width: 768px) {
  .navbar-custom__hamburger {
    display: flex !important;
    order: -1; // Força aparecer primeiro
  }
}
```

### Caso 3: Sidebar não abre

**Sintoma:** Console mostra logs, mas sidebar não aparece

**Diagnóstico:**
1. Verifique se `.mobile-open` está sendo aplicado
2. Verifique `transform` no computed styles
3. Verifique z-index da sidebar

**Solução:**
```scss
.sidebar {
  @media (max-width: 768px) {
    &.mobile-open {
      transform: translateX(0) !important;
      visibility: visible !important;
    }
  }
}
```

### Caso 4: Backdrop não aparece

**Sintoma:** Sidebar abre mas backdrop não aparece

**Diagnóstico:**
```html
<!-- Verifique se tem a classe --visible -->
<div class="sidebar-backdrop sidebar-backdrop--visible">
```

**Solução:**
```scss
.sidebar-backdrop {
  &--visible {
    opacity: 1 !important;
    pointer-events: auto !important;
    display: block !important;
  }
}
```

---

## 📝 Checklist Final

Antes de commitar, verifique:

- [ ] Console mostra: `✅ NavbarComponent initialized`
- [ ] Console mostra: `🍔 Botão hambúrguer clicado!`
- [ ] Console mostra: `📱 Set Mobile Sidebar: true`
- [ ] Sidebar aparece visualmente
- [ ] Backdrop aparece (área escura)
- [ ] Clicar no backdrop fecha a sidebar
- [ ] Body não scrolla com sidebar aberta
- [ ] Sidebar fecha ao navegar para outra rota
- [ ] Em desktop, botão hambúrguer está escondido
- [ ] Touch target do botão é >= 44x44px

---

## 🆘 Ainda não funciona?

### Último recurso: Reset completo

```bash
# 1. Pare o servidor
Ctrl+C

# 2. Limpe cache do Angular
npx ng cache clean

# 3. Reinstale node_modules (se necessário)
rm -rf node_modules
npm install

# 4. Inicie novamente
npm start

# 5. Force refresh no navegador
Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
```

### Teste em navegador diferente

- Chrome DevTools
- Firefox DevTools
- Safari (Mac/iOS)
- Edge

### Teste em dispositivo real

Se possível, teste em um celular real:
```
# Encontre seu IP local
ipconfig (Windows) ou ifconfig (Mac/Linux)

# Abra no celular:
http://SEU_IP:4200
```

---

**Se após todas essas tentativas ainda não funcionar, o problema pode estar em:**
- Angular version incompatível
- Standalone components mal configurados
- Service não está registrado no providers
- Conflito com algum módulo third-party

Envie o erro exato do console para análise mais profunda.
