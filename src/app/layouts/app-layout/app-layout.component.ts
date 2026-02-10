import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-layout',
    imports: [NavbarComponent, FooterComponent, RouterOutlet],
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

 
}
