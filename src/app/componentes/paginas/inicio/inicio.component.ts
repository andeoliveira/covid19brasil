import { ApiClienteService } from './../../../shared/services/api-cliente-service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  form: FormGroup;
  dadosAtuais: any[] = [];
  dadosHistoricos: any[] = [];
  ordenacaoAscendente = true;
  detalharDadosPorEstado = false;
  totalConfirmado: number;
  indexAnt = undefined;

  constructor(private apiService:ApiClienteService, private fb:FormBuilder) {
    this.form = this.fb.group({
      confirmados: [''],
      confirmadosDia: [''],
      ativos: [''],
      recuperados: [''],
      obitos: [''],
      obitosDia: [''],
      estados: [''],
      municipios: [''],
      confirmadosEstado: [''],
      recuperadosEstado: [''],
      obitosEstado: [''],
      ativosEstados: [''],
      estadoSigla: [''],
      dataUltAtualizacao: ['']
    })
  }

  ngOnInit(): void {
    this.carregarDadosTotaisEstado();
    this.carregarTotaisBrasil();
  }

  carregarHistorico() {
    this.apiService.carregarHistorico('confirmed').pipe(take(1)).subscribe(
      res => {
        this.dadosHistoricos = [];
        this.dadosHistoricos = res;
      }
    )
  }

  carregarTotaisBrasil() {
    this.apiService.carregarTotalPais().pipe(take(1)).subscribe(
      result => {if (result) this.atualizarForm(result)}
    )
  }

  atualizarForm(resultApiList) {
    const resultApi = resultApiList[resultApiList.length - 1];
    const resultApiAnt = resultApiList[resultApiList.length - 2];

    if (resultApi) {
      this.resetarForm();
      resultApi.Confirmed ? this.form.get('confirmados').setValue(resultApi.Confirmed) : 'Sem info.';
      resultApi.Recovered ? this.form.get('recuperados').setValue(resultApi.Recovered): 'Sem info.';
      resultApi.Deaths ? this.form.get('obitos').setValue(resultApi.Deaths): 'Sem info.';
      resultApi.Date ? this.form.get('dataUltAtualizacao').setValue(this.gerarDataPtBr(resultApi.Date)): 'Sem info.'
      resultApi.Deaths ? this.form.get('obitosDia').setValue(resultApi.Deaths - resultApiAnt.Deaths) : '';
      resultApi.Confirmed ? this.form.get('confirmadosDia').setValue(resultApi.Confirmed - resultApiAnt.Confirmed) : '';
      let ativos = (resultApi.Confirmed - (resultApi.Recovered - resultApi.Deaths));
      resultApi.Confirmed ? this.form.get('ativos').setValue(ativos) : '0';
      this.form.get('obitosEstado').setValue(resultApi.Deaths);
      this.form.get('confirmadosEstado').setValue(resultApi.Confirmed);
      this.carregarHistorico();
    }

  }

  resetarForm() {
    this.form.get('dataUltAtualizacao').reset();
    this.form.get('ativos').reset();
    this.form.get('recuperados').reset();
  }

  carregarDadosDiaAnteriorPorEstado() {
    this.form.get('estados').reset();
    this.dadosAtuais.forEach(dadoPorEstadoAtual => {
      if (dadoPorEstadoAtual.date) {
        this.apiService.carregarDadosPorEstadoDiaAnterior(this.gerarDataAnterior(dadoPorEstadoAtual.date), dadoPorEstadoAtual.state)
        .pipe(take(1)).subscribe(
          res => {dadoPorEstadoAtual.diaAnterior = res.results[0];}
        );
      }
    });
    this.dadosAtuais.sort((a, b) => (a.state < b.state ? -1 : a.state > b.state ? 1 : 0));
    this.form.get('estados').setValue(this.dadosAtuais);
  }

  ordernarPorEstado() {
    this.ordenacaoAscendente = !this.ordenacaoAscendente;
  }

  resetarDropDown() {
    this.dadosAtuais.forEach(estado => {
      estado.index ? estado.index = undefined : estado.index = undefined;
    })
  }

  detalharEstado(estado:any, index: number) {
    if (estado.index !== undefined) {
      estado.index = undefined;
    } else {
      this.resetarDropDown();
      estado.index = index;
      this.carregarMunicipiosDoEstado(estado.state);
    }
  }

  carregarMunicipiosDoEstado(estadoSigla: any) {
    this.apiService.carregarDadosPorMunicipioDoEstado(estadoSigla).pipe(take(1)).subscribe(
      res => {
        this.form.get('municipios').reset();
        this.form.get('municipios').setValue(res.results);
      }, error => {
        console.log(error);
      }
    )
  }

  carregarDadosTotaisEstado() {
    this.apiService.carregarDadosPorEstadoInicio().pipe(take(1)).subscribe(
      res => {
        this.form.get('estados').reset();
        if (res) {
          this.dadosAtuais = res.results;
          this.carregarDadosDiaAnteriorPorEstado();
        }
      }
    )
  }

  gerarData(date: any): Date {
    let nyear = new Date(date).getFullYear();
    let ndia = new Date(date).getDate() + 1;
    let nmes = new Date(date).getMonth();
    return new Date(nyear, nmes, ndia)
  }

  gerarDataPtBr(data: string): any {
    let nData = null;
    nData = this.gerarData(data).toLocaleDateString('pt-BR');
    return nData;
  }

  gerarDataAnterior(data: string): string {
    const nDate = new Date(data);
    nDate.setDate(nDate.getDate() - 1);
    return nDate.toISOString().split('T')[0];
  }

  atualizarInfoEstado($eventEmitter) {
    const estado = this.dadosAtuais.find(e => e.state === $eventEmitter.id)
    this.form.get('confirmadosEstado').setValue(estado.confirmed);
    this.form.get('obitosEstado').setValue(estado.deaths);
    this.form.get('estadoSigla').setValue($eventEmitter.properties.nome);
  }

}
