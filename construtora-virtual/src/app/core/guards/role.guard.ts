import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth  = inject(AuthService);
  const router = inject(Router);
  const toast  = inject(ToastService);

  if (!auth.estaLogado()) {
    router.navigate(['/login']);
    return false;
  }

  const perfisPermitidos: string[] = route.data['roles'] ?? [];
  if (perfisPermitidos.length === 0) return true;

  const usuario = auth.getUsuario();
  const perfil  = (usuario?.perfil ?? '').toLowerCase();

  if (perfisPermitidos.includes(perfil)) return true;

  toast.erro('Acesso negado. Você não tem permissão para esta área.');
  router.navigate(['/dashboard']);
  return false;
};
