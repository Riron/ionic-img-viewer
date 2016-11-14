import { NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Config } from 'ionic-angular/config/config';

import { ImageViewerDirective } from './image-viewer.directive';
import { ImageViewerComponent } from './image-viewer.component';
import { ImageViewerEnter, ImageViewerLeave } from './image-viewer-transitions';

export function registerCustomTransitions(config: Config) {
	return function() {
		config.setTransition('image-viewer-enter', ImageViewerEnter);
		config.setTransition('image-viewer-leave', ImageViewerLeave);
	};
}

@NgModule({
	imports: [IonicModule],
	declarations: [
		ImageViewerComponent,
		ImageViewerDirective
	],
	exports: [ ImageViewerDirective ],
	entryComponents: [ ImageViewerComponent ],
	providers: [
		{ provide: APP_INITIALIZER, useFactory: registerCustomTransitions, deps: [ Config ], multi: true }
	]
})
export class IonicImageViewerModule {}
