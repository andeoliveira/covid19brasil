import { ApiClienteService } from './../../../shared/services/api-cliente-service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  form: FormGroup;
  dadosDoDiaAnterior: any[] = [];
  dadosAtuais: any[] = [];

  constructor(private apiService:ApiClienteService, private fb:FormBuilder) {
    this.form = this.fb.group({
      confirmados: [''],
      confirmadosDia: [''],
      ativos: [''],
      recuperados: [''],
      mortos: [''],
      mortosDia: [''],
      estados: ['']
    })
  }

  ngOnInit(): void {
    //this.carregarTotaisBrasil();
    this.carregarDadosTotaisEstado();
  }

  carregarTotaisBrasil() {
    this.apiService.carregarTotalPais().subscribe(
      result => {
        if (result) this.atualizarForm(result);
      }
    )
  }

  atualizarForm(resultApiLmao: any) {
    this.form.reset();
    resultApiLmao.cases ? this.form.get('confirmados').setValue(resultApiLmao.cases) : '';
    resultApiLmao.active ? this.form.get('ativos').setValue(resultApiLmao.active) : '';
    resultApiLmao.recovered ? this.form.get('recuperados').setValue(resultApiLmao.recovered): '';
    resultApiLmao.deaths ? this.form.get('mortos').setValue(resultApiLmao.deaths): '';
    resultApiLmao.todayDeaths ? this.form.get('mortosDia').setValue(resultApiLmao.todayDeaths) : '';
    resultApiLmao.todayCases ? this.form.get('confirmadosDia').setValue(resultApiLmao.todayCases) : '';
  }

  gerarFormDadosFinais() {
    this.dadosAtuais.forEach(dadoAtual => {
      const objEstado = this.dadosDoDiaAnterior.find(item => item.state === dadoAtual.state && item.date !== dadoAtual.date)
      dadoAtual.diaAnterior = objEstado;
      console.log(dadoAtual);
    });
    this.form.get('estados').setValue(this.dadosAtuais);
  }

  carregarDadosDiaAnteriorPorEstado() {
    const dataAnterior = this.gerarDataAnterior();
    this.apiService.carregarDadosPorEstadoDiaAnterior(dataAnterior).subscribe(
      res => {
        this.dadosDoDiaAnterior = res.results;
        this.gerarFormDadosFinais();
      }
    )
  }

  carregarDadosTotaisEstado() {
    this.apiService.carregarDadosPorEstadoInicio().subscribe(
      res => {
        this.form.get('estados').reset();
        if (res) {
          this.dadosAtuais =  res.results;
          this.carregarDadosDiaAnteriorPorEstado();
        }
      }
    )
  }

  gerarDataAnterior(): any {
    const dataAtual = new Date();
    const diaAnt = dataAtual.getDate() - 1;
    const ano = dataAtual.getFullYear();

    if ((dataAtual.getMonth()) + 1 < 10) {
      return ano + '-0'+ (dataAtual.getMonth()+1) + '-' + diaAnt;
    } else {
      return ano + (dataAtual.getMonth()+1) + '-' + diaAnt;
    }
  }

}
