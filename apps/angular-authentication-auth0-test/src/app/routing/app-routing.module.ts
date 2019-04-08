import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { routes } from './routes';

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
