import { NgModule } from '@angular/core';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Cargando...',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  bgsColor: '#7b1fa2',
  fgsColor: '#7b1fa2',
  fgsType: SPINNER.squareJellyBox,
  fgsSize: 100,
  hasProgressBar: false,
};

console .log( 'SharedLoaderModule cargado...' );

@NgModule({
  imports: [NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)],
  exports: [NgxUiLoaderModule], 
})
export class SharedLoaderModule {} 
