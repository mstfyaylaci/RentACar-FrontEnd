import { Component } from '@angular/core';

@Component({
  selector: 'app-navi',
  standalone: false,
  templateUrl: './navi.component.html',
  styleUrl: './navi.component.css'
})
export class NaviComponent {

  isAdmin: boolean = false;
}
