import { Transition, Animation, ViewController } from 'ionic-angular';
import { CSS } from 'ionic-angular/util/dom';

export class ImageViewerEnter extends Transition {
	init() {

		let ele = this.enteringView.pageRef().nativeElement;

		let fromPosition = this.enteringView.data.position;
		let toPosition = ele.querySelector('img').getBoundingClientRect();
		let flipS = fromPosition.width / toPosition.width;
		let flipY = fromPosition.top - toPosition.top;
		let flipX = fromPosition.left - toPosition.left;

		let backdrop = new Animation(ele.querySelector('ion-backdrop'));
		let image = new Animation(ele.querySelector('.image'));

		image.fromTo('translateY', `${flipY}px`, '0px')
			.fromTo('translateX', `${flipX}px`, '0px')
			.fromTo('scale', flipS, '1');

		backdrop.fromTo('opacity', '0.01', '1');

		this.easing('ease-in')
			.duration(150)
			.add(backdrop)
			.add(image);

		const enteringPageEle: Element = this.enteringView.pageRef().nativeElement;
		const enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
		const enteringBackBtnEle = enteringPageEle.querySelector('.back-button');

		let enteringNavBar = new Animation(enteringNavbarEle);
		enteringNavBar.beforeAddClass('show-navbar');
		this.add(enteringNavBar);

		let enteringBackButton = new Animation(enteringBackBtnEle);
		this.add(enteringBackButton);
		enteringBackButton.beforeAddClass('show-back-button');
	}
}

export class ImageViewerLeave extends Transition {
	init() {

		let ele = this.leavingView.pageRef().nativeElement;

		let toPosition = this.leavingView.data.position;
		let fromPosition = ele.querySelector('img').getBoundingClientRect();

		let offsetY = 0;
		let imageYOffset = ele.querySelector('.image').style[CSS.transform];
		if (imageYOffset) {
			let regexResult = imageYOffset.match(/translateY\((-?\d+)px\)/);
			offsetY = regexResult ? parseFloat(regexResult[1]) : offsetY;
		}

		let flipS = toPosition.width / fromPosition.width;
		let flipY = toPosition.top - fromPosition.top + offsetY;
		let flipX = toPosition.left - fromPosition.left;

		let backdropOpacity = ele.querySelector('ion-backdrop').style['opacity'];

		let backdrop = new Animation(ele.querySelector('ion-backdrop'));
		let image = new Animation(ele.querySelector('.image'));

		image.fromTo('translateY', `${offsetY}px`, `${flipY}px`)
			.fromTo('translateX', `0px`, `${flipX}px`)
			.fromTo('scale', '1', flipS);

		backdrop.fromTo('opacity', backdropOpacity, '0');

		this.easing('ease-in-out')
			.duration(150)
			.add(backdrop)
			.add(image);
	}
}
