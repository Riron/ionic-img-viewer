import {Transition, TransitionOptions, Animation, ViewController} from 'ionic-angular';
import {CSS} from 'ionic-angular/util/dom';

export class ImageViewerEnter extends Transition {
	constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
		super(enteringView, leavingView, opts);

		let ele = enteringView.pageRef().nativeElement;

		let fromPosition = enteringView.data.position;
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

		let enteringNavBar = new Animation(enteringView.navbarRef());
		enteringNavBar.before.addClass('show-navbar');
		this.add(enteringNavBar);

		let enteringBackButton = new Animation(enteringView.backBtnRef());
		this.add(enteringBackButton);
		enteringBackButton.before.addClass('show-back-button');
	}
}

export class ImageViewerLeave extends Transition {
	constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
		super(enteringView, leavingView, opts);

		let ele = leavingView.pageRef().nativeElement;

		let toPosition = leavingView.data.position;
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