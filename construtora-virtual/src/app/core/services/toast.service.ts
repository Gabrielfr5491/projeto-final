import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  duracao?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts = signal<Toast[]>([]);
  private nextId = 0;

  mostrar(mensagem: string, tipo: Toast['tipo'] = 'info', duracao = 4000) {
    const id = ++this.nextId;
    this.toasts.update(t => [...t, { id, mensagem, tipo, duracao }]);
    setTimeout(() => this.remover(id), duracao);
  }

  sucesso(mensagem: string) { this.mostrar(mensagem, 'sucesso'); }
  erro(mensagem: string) { this.mostrar(mensagem, 'erro', 5000); }
  aviso(mensagem: string) { this.mostrar(mensagem, 'aviso'); }
  info(mensagem: string) { this.mostrar(mensagem, 'info'); }

  remover(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}