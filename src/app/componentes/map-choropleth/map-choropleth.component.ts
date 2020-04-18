import { ApiClienteService } from './../../shared/services/api-cliente-service';
import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'map',
  templateUrl: './map-choropleth.component.html',
  styleUrls: ['./map-choropleth.component.scss']
})
export class MapChoroplethComponent implements OnInit {

  svg: any;
  width: 900;
  height: 500;
  dados: any;
  tooltip: any;
  totalDeCasosBrasil = 250;
  tipoDeGrafico = 'pais';
  @Input() confirmados: number;
  @Input() casosPorEstado: any[];
  g: any;
  @ViewChild("brasil_map", { static: true }) protected chartContainer: ElementRef;

  constructor(private api: ApiClienteService) { }

  ngOnInit(): void {
    this.configurarMapa();
  }

  async configurarMapa() {
    if (this.casosPorEstado && this.casosPorEstado.length > 0) {
      /*cria o svg no html */
      this.svg = d3.select(this.chartContainer.nativeElement);
      this.svg.attr('width', 600);
      this.svg.attr('height', 480);
      /* carrega os dados dos estados preparados para mapa */
      const data = await d3.json("../../../assets/estados-brasil.json" );
      const topology = topojson.feature(data, data.objects['estados']);
      /* cria projeção do mapa centalizada  */
      const projection = d3.geoMercator().scale(580).center([-30, -11]).translate([1000 /2, 300/2 ]);
      projection.fitSize([600, 480], topology);
      /* linha do mapa baseado em Geolocation */
      const path = d3.geoPath().projection(projection);
      /* inicio do conteúdo do SVG */
      this.g = this.svg.append('g');
      /* adiciona os atributos no path e carrega os dados topológicos */
      this.g.attr('class', 'states')
        .selectAll('path')
        .data(topology['features'])
        .enter()
        .append('path')
        .attr('class', 'path-region')
        .style("stroke", "transparent")
        /* Para cada marcação no mapa por estado, preenche com uma cor */
        .attr('fill', (d) => {return this.setarCorPorEstado(d)})
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseover', (d) => {
          d3.selectAll('.path-region')

          d3.select(d3.event.currentTarget)
          .style("opacity", .8)
          .style('stroke', '#222')
        })
        .on('mouseleave', (d) => {
          d3.selectAll(".path-region")

          d3.select(d3.event.currentTarget)
          .style("opacity", 1.0)
          .style('stroke', 'transparent')
        })
        .on('touchstart', (d) => {
        //if (onceTouchedRegion === d) onceTouchedRegion = null;
        //else onceTouchedRegion = d;
        })
        .on('click', (d) => {
          //if (onceTouchedRegion) {
          //return;
        //}
        //if (mapMeta.mapType === MAP_TYPES.STATE) {
          //return;
        //}
        //changeMap(d.properties[propertyField], mapMeta.mapType);
        })
        .style('cursor', 'pointer')
        .append('title')
        .text((d) => this.mostrarTituloPorEstado(d));

        this.g.append("g")
        .attr("class", "states")
        .selectAll("text")
        .data(topology['features'])
        .enter()
        .append("svg:text")
        .text((d) => {return d.id})
        .attr("x", (d) => path.centroid(d)[0])
        .attr("y", (d) => path.centroid(d)[1])
        .attr("text-anchor","middle")
        .attr('font-size', '0.6em')
        .attr('fill', '#6c757d')
        .attr('font-weight', 'bold')
        .attr('font-family', 'Archia')
        .attr('font-style', 'normal')

        this.svg.append('path')
          .attr('stroke', '#ff073a20')
          .attr('fill', 'none')
          .attr('stroke-width', 2)
          .attr('d', path(topojson.mesh(data, data.objects['estados'])));

    }
  }

  setarCorPorEstado(estadoDoGrafico: any): any {
    const estado = this.casosPorEstado.find(e => e.state === estadoDoGrafico.id)
    const cor = estado.confirmed === null ? '#fff' : d3.interpolateReds( (estado.confirmed * 8) / (this.confirmados || 0.001))
    return cor;
  }

  mostrarTituloPorEstado(estadoDoGrafico:any) : any {
    const estado = this.casosPorEstado.find(e => e.state === estadoDoGrafico.id)
    const totalPercentual = parseFloat((100 * (estado.confirmed / this.confirmados)).toFixed(2));
    return totalPercentual.toString() +'% para ' + estadoDoGrafico.properties['nome']
  }

  setarNomeEstado(estadoDoGrafico: any) : any {
    const index = this.casosPorEstado.map(e => e.state).indexOf(estadoDoGrafico.id);
    const nomeEstado = this.casosPorEstado[index].confirmed;
  }

}
