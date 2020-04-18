import { ApiClienteService } from './../../../shared/services/api-cliente-service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as d3 from 'd3';
import { svg } from 'd3';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  form: FormGroup;
  dadosDoDiaAnterior: any[] = [];
  dadosAtuais: any[] = [];
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
      mortos: [''],
      mortosDia: [''],
      estados: [''],
      municipios: ['']
    })
  }

  ngOnInit(): void {
    this.carregarDadosTotaisEstado();
    this.carregarTotaisBrasil();
  }

  carregarTotaisBrasil() {
    this.apiService.carregarTotalPais().subscribe(
      result => {
        if (result) this.atualizarForm(result);
      }
    )
  }

  atualizarForm(resultApiLmao: any) {
    console.log(resultApiLmao)
    resultApiLmao.cases ? this.form.get('confirmados').setValue(resultApiLmao.cases) : '';
    resultApiLmao.active ? this.form.get('ativos').setValue(resultApiLmao.active) : '';
    resultApiLmao.recovered ? this.form.get('recuperados').setValue(resultApiLmao.recovered): '';
    resultApiLmao.deaths ? this.form.get('mortos').setValue(resultApiLmao.deaths): '';
    resultApiLmao.todayDeaths ? this.form.get('mortosDia').setValue(resultApiLmao.todayDeaths) : '';
    resultApiLmao.todayCases ? this.form.get('confirmadosDia').setValue(resultApiLmao.todayCases) : '';
  }

  carregarDadosDiaAnteriorPorEstado() {
    this.form.get('estados').reset();
    this.dadosAtuais.forEach(dadoPorEstadoAtual => {
      if (dadoPorEstadoAtual.date) {
        this.apiService.carregarDadosPorEstadoDiaAnterior(this.gerarDataAnterior(dadoPorEstadoAtual.date), dadoPorEstadoAtual.state).subscribe(
          res => {dadoPorEstadoAtual.diaAnterior = res.results[0];}
        );
      }
    });
    this.form.get('estados').setValue(this.dadosAtuais);
  }

  ordernarPorEstado() {
    this.ordenacaoAscendente = !this.ordenacaoAscendente;
  }

  resetDropDown() {
    this.dadosAtuais.forEach(estado => {
      estado.index ? estado.index = undefined : estado.index = undefined;
    })
  }

  detalharEstado(estado:any, index: number) {
    if (estado.index !== undefined) {
      estado.index = undefined;
    } else {
      this.resetDropDown();
      estado.index = index;
      this.carregarMunicipiosDoEstado(estado.state);
    }
  }

  carregarMunicipiosDoEstado(estadoSigla: any) {
    this.apiService.carregarDadosPorMunicipioDoEstado(estadoSigla).subscribe(
      res => {
        this.form.get('municipios').reset();
        this.form.get('municipios').setValue(res.results);
      }, error => {
        console.log(error);
      }
    )
  }

  carregarDadosTotaisEstado() {
    this.apiService.carregarDadosPorEstadoInicio().subscribe(
      res => {
        this.form.get('estados').reset();
        if (res) {
          this.dadosAtuais = res.results;
          console.log(this.dadosAtuais);
          this.carregarDadosDiaAnteriorPorEstado();
        }
      }
    )
  }

  gerarDataAnterior(data: string): string {
    const nDate = new Date(data);
    nDate.setDate(nDate.getDate() - 1);
    return nDate.toISOString().split('T')[0];
  }

}
