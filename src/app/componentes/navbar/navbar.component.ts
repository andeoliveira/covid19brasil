import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() paginas: any;
  constructor(public router:ActivatedRoute) { }

  ngOnInit(): void {
  }

  //isActive(rota: string): boolean {
    //return this.router.snapshot.paramMap
  //}

}
