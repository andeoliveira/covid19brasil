import { ApiClienteService } from './../../../shared/services/api-cliente-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private apiService:ApiClienteService) { }

  ngOnInit(): void {
    this.carregarDadosTotaisEstado();
  }

  carregarDadosTotaisEstado() {
    this.apiService.carregarDadosPorEstadoInicio().subscribe(
      result => {
        console.log(result)
      }
    )
  }

}
