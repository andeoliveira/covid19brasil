import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss']
})
export class TimeseriesComponent implements OnInit {

  svg: any;
  ts: any;
  width: number = 400;
  height = 300;
  margin = 30;
  dadosFinais: any[] = [];
  dadosHistoricoBrasil: any[] = [];
  @Input() dadosBrasil: any[];
  @ViewChild("series_brasil", { static: true }) protected seriesContainer: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.configurarTimeSeries()
  }

  async configurarTimeSeries() {

    this.dadosHistoricoBrasil = this.dadosBrasil.filter(dado => dado.Cases > 1000)
    this.svg = d3.select(this.seriesContainer.nativeElement)
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform","translate(70,15)")

    // Dados na horizontal -> Datas dos casos (eixo x)
    const vlrExtentDate = d3.extent(this.dadosHistoricoBrasil, (dado:any) => {
      return this.gerarData(dado.Date);
    });

    const x = d3.scaleTime().domain(vlrExtentDate).range([ 0, this.width - this.margin - 50]);

    this.svg.append("g")
      .attr("transform", `translate(-4, ${this.height - this.margin - 20})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat('%d/%m')).tickSizeOuter(0));

    // Dados na vertical -> Quantidade de casos (eixo y)
    const vlrExtentCases = d3.extent(this.dadosHistoricoBrasil, (d:any) => +d.Cases);
    const y = d3.scaleLinear().domain(vlrExtentCases).range([this.height - this.margin - 50, 0]);

    this.svg.append("g")
      .attr("transform", `translate(-4, ${this.margin - 2})`)
      .call(d3.axisLeft(y).ticks(10).tickSizeOuter(1).tickFormat(d3.format('.2s')));

     //Área dos dados - traçado da linha
    this.svg.append("path")
      .datum(this.dadosHistoricoBrasil)
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .1)
      .attr("stroke", "none")
      .attr("transform", `translate(-4, ${this.margin})`)
      // desenha a área
      .attr("d", d3.area()
              .x((d:any) => {return x(this.gerarData(d.Date))})
              .y0(this.height - this.margin - 50 )
              .y1((d: any) => y(d.Cases))
      )

    //traçado da linha
    this.svg.append("path")
      .datum(this.dadosHistoricoBrasil)
      .attr("fill", "none")
      .attr("stroke", "#ff073a20")
      .attr("stroke-width", 3)
      .attr("transform", `translate(-4, ${this.margin})`)
      .attr("d", d3.line()
        .x((d: any) => {return x(this.gerarData(d.Date))})
        .y((d: any) => y(d.Cases))
      )

   //"circulos"
    this.svg.selectAll("myCircles")
      .data(this.dadosHistoricoBrasil)
      .enter()
      .append("circle")
      .attr("transform", `translate(-4, ${this.margin})`)
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", (d:any) => {return x(this.gerarData(d.Date))})
      .attr("cy", (d:any) => {return y(d.Cases) })
      .attr("r", 3)

  }

  gerarData(date: any): Date {
    let nyear = new Date(date).getFullYear();
    let ndia = new Date(date).getDate() + 1;
    let nmes = new Date(date).getMonth();
    return new Date(nyear, nmes, ndia)
  }
}
