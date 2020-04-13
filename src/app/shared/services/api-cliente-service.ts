import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClienteService {

  urlBrasilIo = 'https://brasil.io/api/dataset/covid19/';
  urlCoronaLmao = 'https://corona.lmao.ninja/v2/countries/brasil?yesterday=false&strict=false';
  constructor(private http:HttpClient) {}

  carregarTotalPais(): Observable<any> {
    return this.http.get(this.urlCoronaLmao);
  }

  carregarDadosPorEstadoInicio(): Observable<any> {
    const detalhe = 'caso/data?is_last=True&place_type=state';
    return this.http.get<any>(this.urlBrasilIo + detalhe);
  }

  carregarDadosPorEstadoDiaAnterior(data: any, estadoSigla: any): Observable<any> {
    const detalheAnt = `caso/data?search=&date=${data}&state=${estadoSigla}&place_type=state`;
    return this.http.get<any>(this.urlBrasilIo + detalheAnt);
  }

  carregarDadosPorMunicipioDoEstado(estadoSigla: any): Observable<any> {
    const detalhe = `caso/data?is_last=True&state=${estadoSigla}`;
    return this.http.get<any>(this.urlBrasilIo + detalhe);
  }

  carregarMensagensBanner(): Observable<any> {
    const mensagens = [
      { id: 1, mensagem: 'Your essential needs will be taken care of by the government in a timely manner. Please do not hoard.  ' },
      { id: 2, mensagem: 'Modo pânico : OFF! ❌ ESSENTIALS ARE ON! ✔️  ' },
      { id: 3, mensagem: 'Planejar e calcular suas necessidades essenciais para os próximos dias.  ' },
      { id: 4, mensagem: 'Evite sair de casa, evite aglomerações. Ajude a quebrar a cadeia de propagação.  ' },
    ]
    return of (mensagens)
  }
}
