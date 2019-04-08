import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback.component';

@NgModule({
  declarations: [
    CallbackComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CallbackComponent
  ]
})
export class GafAuth0CallbackModule { }
