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
      this.svg = d3.select(this.chartContainer.nativeElement);
      this.svg.attr('width', 600);
      this.svg.attr('height', 480);

      const data = await d3.json("../../../assets/estados-brasil.json" );
      const topology = topojson.feature(data, data.objects['estados']);
      const projection = d3.geoMercator().scale(580).center([-30, -11]).translate([1000 /2, 300/2 ]);
      projection.fitSize([600, 480], topology);
      const path = d3.geoPath().projection(projection);
      this.svg.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology['features'])
        .enter()
        .append('path')
        .attr('class', 'path-region')
        .attr('fill', (d) => {
            const index = this.casosPorEstado.map(e => e.state).indexOf(d.id);
            const cor = index === 0 ? '#fff' :
            d3.interpolateReds( (0.8 * ( (index + 1) * 1200)) / (this.confirmados || 0.001))
            console.log(index);
            return cor;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseover', (d) => {
          //handleMouseover(d.properties[propertyField]);
        })
        .on('mouseleave', (d) => {
          //setSelectedRegion(null);
          //if (onceTouchedRegion === d) onceTouchedRegion = null;
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
        .text(function (d) {
          /*const value = mapData[d.properties[propertyField]] || 0;
        return (
          Number(
            parseFloat(100 * (value / (statistic.total || 0.001))).toFixed(2)
          ).toString() +
          '% from ' +
          toTitleCase(d.properties[propertyField])
        );*/
        });

        this.svg.append('path')
        .attr('stroke', '#ff073a20')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr(
          'd',
          path(topojson.mesh(data, data.objects['estados']))
        );
    }
  }
}
