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
  width: number = 500;
  height = 280;
  margin = 20;
  dadosFinais: any[] = [];
  @Input() dadosBrasil: any[];
  @ViewChild("series_brasil", { static: true }) protected seriesContainer: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.configurarTimeSeries()
  }

  async configurarTimeSeries() {

    this.dadosBrasil = this.dadosBrasil.filter(dado => dado.Cases > 60)
    this.svg = d3.select(this.seriesContainer.nativeElement)
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform","translate(50,10)")

    // Dados na horizontal -> Data dos cados
    const vlrExtentDate = d3.extent(this.dadosBrasil, (dado:any)=> new Date(dado.Date));
    const x = d3.scaleTime().domain(vlrExtentDate).range([ 0, this.width - 70]);

    this.svg.append("g")
      .attr("transform", `translate(-5, ${this.height - this.margin - 10})`)
      .call(d3.axisBottom(x).ticks(8).tickSizeOuter(0));

    // Dados na vertical -> Quantidade de casos
    const vlrExtentCases = d3.extent(this.dadosBrasil, (d:any) => +d.Cases);
    const y = d3.scaleLinear()
    .domain(vlrExtentCases)
    .range([ this.height - 40, 0 ]);
    this.svg.append("g")
    .attr("transform", `translate(-5, ${this.margin - 10})`)
    .call(d3.axisLeft(y).tickSizeOuter(0));

     //Área dos dados
     this.svg.append("path")
     .datum(this.dadosBrasil)
     .attr("fill", "#69b3a2")
     .attr("fill-opacity", .1)
     .attr("stroke", "none")
     .attr("d", d3.area()
                .x((d:any) => {
                  return x(new Date(d.Date))
                })
                .y0( this.height - this.margin - 10)
                .y1((d: any) => y(d.Cases))
      )
       // Add the line

       this.svg.append("path")
    .datum(this.dadosBrasil)
    .attr("fill", "none")
    .attr("stroke", "#ff073a20")
    .attr("stroke-width", 4)
    .attr("d", d3.line()
      .x((d: any) => x(new Date(d.Date)))
      .y((d: any) => y(d.Cases))
    )

   // Add the line
    this.svg.selectAll("myCircles")
      .data(this.dadosBrasil)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("stroke", "none")
      .attr("cx", function(d:any) { return x(new Date (d.Date)) })
      .attr("cy", function(d:any) { return y(d.Cases) })
      .attr("r", 3)


  }
}
