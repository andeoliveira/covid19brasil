import { ApiClienteService } from './../../shared/services/api-cliente-service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  form: FormGroup;
  mensagem: any = {};

  constructor(private apiService: ApiClienteService, private fb:FormBuilder) {
    this.form = this.fb.group({
      mensagem: [''],
      link: ['']
    })
  }

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens() {
    this.apiService.carregarMensagensBanner().subscribe(
      result =>  {
        if (this.mensagem) {
          this.atualizarMensagem(result);
        }

      }, error => {
        console.log(error);
        this.mensagem = {};
      }
    )
  }

  atualizarMensagem(mensagens: any) {
    this.form.get('mensagem').setValue(mensagens[0].mensagem);
    setInterval(e => {
      const random = Math.floor(Math.random() * 12);
      const mensagemRandom = random % mensagens.length;
      const objMensagem = mensagens[mensagemRandom];
      this.form.get('mensagem').setValue(objMensagem.mensagem);
      this.form.get('link').reset();
      this.form.get('link').setValue(objMensagem.link);
    }, 5000)
  }
}
