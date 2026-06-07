import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  mostrar(
    mensagem: string
  ) {

    alert(mensagem);
  }
}