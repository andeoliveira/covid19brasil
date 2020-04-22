import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiClienteService {

  urlBrasilIo = 'https://brasil.io/api/dataset/covid19/';
  urlCovid19 = 'https://api.covid19api.com/';
  urlCoronaLmao = 'https://corona.lmao.ninja/v2/';
  urlEstadoJson = 'https://gist.githubusercontent.com/marialuisacp/4a663a1980c56ecb847e94e232a55f2a/raw/efcc7638dfbe6ea23caa89a6c17d0ad49f128752/br-states-info.json';
  constructor(private http:HttpClient) {}

  carregarTotalPais(): Observable<any> {
    return this.http.get(this.urlCovid19 + 'live/country/brazil/status/confirmed');
  }

  carregarEstadoJsonMap(): Observable<any> {
    return this.http.get(this.urlEstadoJson);
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

  carregarHistorico(status: string):Observable<any> {
    return this.http.get(this.urlCovid19 + 'total/dayone/country/brazil/status/'+status);
  }
  carregarMensagensBanner(): Observable<any> {
    const mensagens = [
      { id: 1, mensagem: 'Modo pânico : OFF! ❌ Modo conciente! ON ✔️  ' },
      { id: 2, mensagem: 'Planejar e calcular suas necessidades essenciais para os próximos dias.  ' },
      { id: 3, mensagem: 'Evite sair de casa, evite aglomerações. Ajude a quebrar a cadeia de propagação.  ' },
      { id: 4, mensagem: 'Atenção, antes de compartilhar informações sobre saúde, verifique sua autenticidade.  ' },
    ]
    return of (mensagens)
  }
}
