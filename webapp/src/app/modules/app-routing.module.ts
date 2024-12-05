import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  constructor(router: Router, activatedRoute: ActivatedRoute, title: Title) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event) => {
        const pageTitle = router.routerState.snapshot.root.children[0].data['title'];
        if (pageTitle) {
            title.setTitle(pageTitle);
        } else if (pageTitle !== false) {
          title.setTitle('AWS IoT Secure Tunneling Web Local Proxy')
        }
        // if (event instanceof NavigationEnd) {
        //   ga('set', 'page', event.urlAfterRedirects);
        //   ga('send', 'pageview');
        // }
    });
}

}
