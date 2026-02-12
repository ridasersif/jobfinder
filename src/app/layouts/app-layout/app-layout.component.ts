import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import {  NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter } from 'rxjs';

@Component({
    selector: 'app-layout',
    imports: [NavbarComponent, FooterComponent, RouterOutlet],
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {

  constructor(private router: Router) { }

  isJobsRoute: boolean = false;

 ngOnInit(): void {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        this.isJobsRoute = this.router.url.includes('jobs');
      });
  }

}
