import { LinksComponent } from './componentes/links/links.component';
import { SobreComponent } from './componentes/sobre/sobre.component';
import { DemograficoComponent } from './componentes/paginas/demografico/demografico.component';
import { InicioComponent } from './componentes/paginas/inicio/inicio.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'demografico',
    component: DemograficoComponent
  },
  {
    path: 'sobre',
    component: SobreComponent
  },
  {
    path: 'links-de-ajuda',
    component: LinksComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
