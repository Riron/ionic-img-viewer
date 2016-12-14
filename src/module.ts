import { NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Config } from 'ionic-angular/config/config';

import { ImageViewerCarouselComponent } from './image-viewer-carousel.component';
import { ImageViewerDirective } from './image-viewer.directive';
import { ImageViewerComponent } from './image-viewer.component';
import { registerCustomTransitions } from './image-viewer-transitions';

@NgModule({
	imports: [IonicModule],
	declarations: [
		ImageViewerCarouselComponent,
		ImageViewerComponent,
		ImageViewerDirective
	],
	exports: [ ImageViewerDirective, ImageViewerCarouselComponent ],
	entryComponents: [ ImageViewerComponent ],
	providers: [
		{ provide: APP_INITIALIZER, useFactory: registerCustomTransitions, deps: [ Config ], multi: true }
	]
})
export class IonicImageViewerModule {}
