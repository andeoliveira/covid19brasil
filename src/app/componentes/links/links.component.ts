import { Observable } from 'rxjs';
import { ApiClienteService } from './../../shared/services/api-cliente-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  links$: Observable<any>;

  constructor(public api:ApiClienteService) { }

  ngOnInit(): void {
    this.links$ = this.api.carregarLinksBoletins();
  }

}
