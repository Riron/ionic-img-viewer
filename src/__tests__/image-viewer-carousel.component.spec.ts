import { App } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ImageViewerDirective } from '../image-viewer.directive';
import { ImageViewerCarouselComponent } from '../image-viewer-carousel.component';

class AppMock {
	present(...args) {
		// Mocked
	}
}

describe('Image viewer carousel container', () => {
	let fixture, component;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ImageViewerCarouselComponent, ImageViewerDirective, FilledCarousel],
			providers: [{provide: App, useClass: AppMock}]
		});
		TestBed.compileComponents();
		fixture = TestBed.createComponent(FilledCarousel);
		component = fixture.componentInstance;
	});

	it('should bind imageViewerItems to the carousel', () => {
		fixture.detectChanges();

		expect(component.carousel.imageViewerItems.length).toBe(3);
	});

	it('should bind the carousel to the items', () => {
		fixture.detectChanges();

		const items = component.carousel.imageViewerItems;
		items.forEach(i => expect(i.carousel).toBe(component.carousel));
	});

	it('should propagate item click to the carousel', () => {
		fixture.detectChanges();

		const firstItem = component.carousel.imageViewerItems.first;
		spyOn(component.carousel, 'onClick');

		firstItem.onClick(null);
		expect(component.carousel.onClick).toHaveBeenCalledWith(firstItem);
	});
});

@Component({
	template: `
		<h1>Carousel test</h1>
		<image-viewer-carousel>
			<img src="1.jpg" imageViewer />
			<img src="2.jpg" imageViewer />
			<img src="3.jpg" imageViewer />
		</image-viewer-carousel>
	`
})
class FilledCarousel {
	@ViewChild(ImageViewerCarouselComponent) carousel: ImageViewerCarouselComponent;
}
