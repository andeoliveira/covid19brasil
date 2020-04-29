import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag:Function;
declare let fbq:Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Covid19 Brasil dados atualizados';
  constructor(private router: Router) {
    router.events.subscribe((nav: NavigationEnd) => {
      if (nav instanceof NavigationEnd) {
        gtag('config','UA-1051182-11',{'page_path' : nav.url});
      }
    })
  }
}
