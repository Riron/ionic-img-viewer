import { NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Config } from 'ionic-angular/config/config';

import { ImageViewerDirective } from './image-viewer.directive';
import { ImageViewerComponent } from './image-viewer.component';
import { ImageViewerController } from './image-viewer.controller';

@NgModule({
	imports: [IonicModule],
	declarations: [
		ImageViewerComponent,
		ImageViewerDirective
	],
	providers: [ ImageViewerController ],
	exports: [ ImageViewerDirective ],
	entryComponents: [ ImageViewerComponent ]
})
export class IonicImageViewerModule {}
