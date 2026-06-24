import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.estaLogado()) {
    const usuario = auth.getUsuario();
    const perfil = usuario?.perfil?.toLowerCase();

    if (perfil === 'administrador' || perfil === 'admin') {
      return true;
    }
  }

  toast.erro('Acesso negado. Apenas administradores podem acessar esta área.');
  router.navigate(['/dashboard']);
  return false;
};
