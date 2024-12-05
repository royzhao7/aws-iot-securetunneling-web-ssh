import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  progress= false;
  isLoggedIn = false;
  user: { id: string; username: string; email: string };

  constructor(private uiService: UiService) { }

  ngOnInit() {


    this.uiService.progressBar$.subscribe((toggle: boolean) => this.progress = toggle);
  }
  onToggleMenu() {
    this.uiService.menuToggle$.next(true);
}

onLogOut(){

}

}
