import { LinksComponent } from './componentes/links/links.component';
import { SobreComponent } from './componentes/sobre/sobre.component';
import { InicioComponent } from './componentes/paginas/inicio/inicio.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'sobre',
    component: SobreComponent
  },
  {
    path: 'links',
    component: LinksComponent
  },
  {
    path: '**',
    component: InicioComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
