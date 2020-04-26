import { ApiClienteService } from './shared/services/api-cliente-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InicioComponent } from './componentes/paginas/inicio/inicio.component';
import { DemograficoComponent } from './componentes/paginas/demografico/demografico.component';
import { BannerComponent } from './componentes/banner/banner.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { MapChoroplethComponent } from './componentes/map-choropleth/map-choropleth.component';
import { TimeseriesComponent } from './componentes/timeseries/timeseries.component';
import { SobreComponent } from './componentes/sobre/sobre.component';
import { LinksComponent } from './componentes/links/links.component';
import { FooterComponent } from './componentes/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BannerComponent,
    InicioComponent,
    DemograficoComponent,
    MapChoroplethComponent,
    TimeseriesComponent,
    SobreComponent,
    LinksComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [ApiClienteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
