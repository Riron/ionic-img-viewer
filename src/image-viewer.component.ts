import {
  DomController,
  NavController,
  NavParams,
  Ion,
  GestureController,
  Config,
  Platform, Slides,
} from 'ionic-angular';
import {ChangeDetectorRef,ChangeDetectionStrategy,ElementRef, Renderer, Component, OnInit, OnDestroy, AfterViewInit, NgZone, ViewChild} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {ImageViewerSrcAnimation} from './image-viewer-src-animation';
import {ImageViewerTransitionGesture} from './image-viewer-transition-gesture';
import {ImageViewerZoomGesture} from './image-viewer-zoom-gesture';
import { IconOptions } from './image-viewer';

@Component({
  selector: 'image-viewer',
  templateUrl: 'image-viewer.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent extends Ion implements OnInit, OnDestroy, AfterViewInit {
  public imageUrl: SafeUrl[] = [];
  public imageCurIndex: number = 0;
  public originalSrc: string;
  public title: string;
  public iconsRight: IconOptions[];
  public imageId:number;
  // public safeImage: SafeUrl[] = [];

  public dragGesture: ImageViewerTransitionGesture;

  @ViewChild('imageContainer') imageContainer;
  @ViewChild('image') image;
  @ViewChild('sliderContainer') sliderContainer: Slides;

  private pinchGesture: ImageViewerZoomGesture;

  public isZoomed: boolean;

  private unregisterBackButton: Function;

  constructor(public _gestureCtrl: GestureController,
              public elementRef: ElementRef,
              private _cd: ChangeDetectorRef,
              private _nav: NavController,
              private _zone: NgZone,
              private renderer: Renderer,
              private domCtrl: DomController,
              private platform: Platform,
              _navParams: NavParams,
              _config: Config,
              private _sanitizer: DomSanitizer) {
    super(_config, elementRef, renderer);

    const url = _navParams.get('image');
    this.imageCurIndex = _navParams.get('imageCurIndex') || 0;
    this.title = _navParams.get('title') ||"";
    this.iconsRight = _navParams.get('iconsRight') ||[];
    this.imageId = _navParams.get('imageId') ||null;
    this.updateImageSrc(url);

  }
  onIconClick(icon:IconOptions){
    this._nav.pop();
    icon.cb(this.imageId);
  }
  updateImageSrc(src) {
    if (Array.isArray(src)) {
      let srcLen = src.length;
      let safeImage: SafeUrl[] = [];
      for (let i = 0; i < srcLen; i++) {
        if(this.originalSrc === src[i]){
          // this.imageCurIndex = i;
          if(this.imageUrl.length){
            safeImage.unshift(this.imageUrl[0]);
          }else{
            safeImage.unshift(this._sanitizer.bypassSecurityTrustUrl(src[i]));
          }
          continue;
        }
        safeImage.push(this._sanitizer.bypassSecurityTrustUrl(src[i]));
      }
      this.imageUrl = safeImage;
    } else {
      this.originalSrc = src;
      this.imageUrl.push(this._sanitizer.bypassSecurityTrustUrl(src));
    }
    this._cd.markForCheck();
  }

  updateImageSrcWithTransition(src) {
    const imageElement = this.image.nativeElement;
    const lowResImgWidth = imageElement.clientWidth;

    this.updateImageSrc(src);

    const animation = new ImageViewerSrcAnimation(this.platform, this.image);
    imageElement.onload = () => animation.scaleFrom(lowResImgWidth);
  }

  ngOnInit() {
    const navPop = () => this._nav.pop();

    this.unregisterBackButton = this.platform.registerBackButtonAction(navPop);
    this._zone.runOutsideAngular(() => this.dragGesture = new ImageViewerTransitionGesture(this.platform, this, this.domCtrl, this.renderer, navPop));
  }

  ngAfterViewInit() {
    // imageContainer is set after the view has been initialized
    this._zone.runOutsideAngular(() => this.pinchGesture = new ImageViewerZoomGesture(this, this.imageContainer, this.platform, this.renderer));
  }

  ngOnDestroy() {
    this.dragGesture && this.dragGesture.destroy();
    this.pinchGesture && this.pinchGesture.destroy();

    this.unregisterBackButton();
  }
}
