import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClienteService {

  url = 'https://brasil.io/api/dataset/covid19/';

  constructor(private http:HttpClient) {

  }

  carregarDadosPorEstadoInicio(): Observable<any> {
    const detalhe = 'caso/data?is_last=True&place_type=state';
    return this.http.get<any>(this.url + detalhe);
  }

  carregarMensagensBanner(): Observable<any> {
    const mensagens = [
      { id: 11, mensagem: 'Your essential needs will be taken care of by the government in a timely manner. Please do not hoard.  ' },
      { id: 12, mensagem: 'Panic mode : OFF! ❌ ESSENTIALS ARE ON! ✔️  ' },
      { id: 13, mensagem: 'Plan and calculate your essential needs for the next three weeks.  ' },
      { id: 14, mensagem: 'Avoid going out during the lockdown. Help break the chain of spread.  ' },
    ]
    return of (mensagens)
  }
}
