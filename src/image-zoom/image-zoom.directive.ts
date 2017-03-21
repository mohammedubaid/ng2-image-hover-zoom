/**
 * Created by craftsvilla on 15/03/17.
 */
import { Directive, Input, ElementRef, ComponentFactoryResolver, ComponentRef, ViewContainerRef, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { ImageZoomContainer } from './image-zoom-container.component';
import { ZoomLensContainer } from './zoom-lens-container.component';

@Directive({
  selector: '[imageZoom]'
})
export class ImageZoomDirective implements OnChanges {
  @Input() imageZoom: string;
  public img: HTMLImageElement;
  private _zoomedImage: HTMLImageElement;
  public zoomContainer: ImageZoomContainer;
  public lensContainer: ZoomLensContainer;
  private _imageZoomContainerRef: ComponentRef<ImageZoomContainer>;
  private _lensContainerRef: ComponentRef<ZoomLensContainer>;
  public _imageLoaded: boolean = false;
  public _componentsCreated:boolean = false;
  public _zoomedImageLoaded: boolean = false;
  public _zoomedImageWidth: number;
  public _zoomedImageHeight: number;
  public _moveImagePosX:boolean = true;
  public _moveImagePosY:boolean = true;
  @HostListener('mouseover', ['$event'])
  onMouseOver(event: any) {
    if(typeof window !== 'undefined' && window.innerWidth > 992) {
      this._elementRef.nativeElement.style.cursor = this._zoomedImageLoaded ? 'crosshair' : 'wait';
      if(this._imageLoaded) {
        this.zoomContainer.setVisibility(true);
        this.lensContainer.setVisibility(true);
        this.setImageStyle(event);
        this.setLensContainerStyle(event);
      }
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut() {
    if(typeof window !== 'undefined' && window.innerWidth > 992) {
      this.zoomContainer.setVisibility(false);
      this.lensContainer.setVisibility(false);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove() {
    if(typeof window !== 'undefined' && window.innerWidth > 992) {
      this.setLensContainerStyle(event);
      this.setImageStyle(event);
    }
  }

  constructor(
      private _componentFactoryResolver: ComponentFactoryResolver,
      private _viewContainerRef: ViewContainerRef,
      private _elementRef: ElementRef
  ) {
    if(this._elementRef.nativeElement.nodeName !== 'IMG') {
      console.error('ImageZoom not placed on image element', this._elementRef.nativeElement);
      return;
    }
    this.img = this._elementRef.nativeElement;
    this.img.onload = () => {
      this._imageLoaded = true;
      if(this._componentsCreated) { // Possible race condition if the component resolver hasn't finished yet
        this.imageChanged();
      }
    };

    let imageZoomContainerFactory = this._componentFactoryResolver.resolveComponentFactory(ImageZoomContainer);
    let imageLensContainerFactory = this._componentFactoryResolver.resolveComponentFactory(ZoomLensContainer);
    this._imageZoomContainerRef = this._viewContainerRef.createComponent(imageZoomContainerFactory);
    this._lensContainerRef = this._viewContainerRef.createComponent(imageLensContainerFactory);
    this.zoomContainer = this._imageZoomContainerRef.instance;
    this.lensContainer = this._lensContainerRef.instance;
    this._componentsCreated = true;

    if(this._imageLoaded) {
      this.imageChanged();
    }
  }

  private imageChanged() {
    this._zoomedImageLoaded = false;
    this._zoomedImage = new Image();
    this._zoomedImage.onload = () => {
      this._zoomedImageWidth = this._zoomedImage.width;
      this._zoomedImageHeight = this._zoomedImage.height;
      this._zoomedImageLoaded = true;
      this.setImageZoomContainer();
    };
    this._zoomedImage.src = this.imageZoom ? this.imageZoom : this.img.src;
  }

  private setImageZoomContainer() {
    let options:any = {};
    let left = this._elementRef.nativeElement.width + this._elementRef.nativeElement.offsetLeft + 50;
    let top = this._elementRef.nativeElement.offsetTop;
    options['left'] = left;
    options['src'] = this._zoomedImage.src;
    options['top'] = top;
    options['height'] = this._elementRef.nativeElement.offsetHeight;
    options['width'] = this._elementRef.nativeElement.offsetWidth;
    this.zoomContainer.setOptions(options);
  }

  private setLensContainerStyle(event:any) {
    let options:any = {};
    let boundry = this._elementRef.nativeElement.getBoundingClientRect();
    let imagePointerX = event.offsetX;
    let imagePointerY = event.offsetY;
    let imageWidth = this._elementRef.nativeElement.offsetWidth;
    let imageHeight = this._elementRef.nativeElement.offsetHeight;
    let scaleX = imageWidth / this._zoomedImageWidth;
    let scaleY = imageHeight / this._zoomedImageHeight;
    let width =  imageWidth * scaleX;
    let height = imageHeight * scaleY;
    let left = imagePointerX - (width / 2);
    let top = imagePointerY - (height / 2);
    if(boundry.left > left) {
      options['left'] = boundry.left;
      this._moveImagePosX = false;
    } else if(left > (boundry.width - width)) {
      options['left'] = boundry.width - width;
      this._moveImagePosX = false;
    } else {
      options['left'] = left;
      this._moveImagePosX = true;
    }
    if(boundry.top > top) {
      options['top'] = boundry.top;
      this._moveImagePosY = false;
    } else if(top > (boundry.height - height)) {
      options['top'] = boundry.height - height;
      this._moveImagePosY = false;
    } else {
      options['top'] = top;
      this._moveImagePosY = true;
    }
    options['height'] = height;
    options['width'] = width;
    this.lensContainer.setOptions(options);
  }

  setImageStyle(event: any) {
    let backgroundPos = this.getbackgroundPos(event);
    this.zoomContainer.setBackgroundPosition(backgroundPos);
  }

  getbackgroundPos(event: any) {
    let imagePointerX = event.offsetX;
    let imagePointerY = event.offsetY;
    let imageWidth = this._elementRef.nativeElement.offsetWidth;
    let imageHeight = this._elementRef.nativeElement.offsetHeight;
    let backgroundPos = '0px 0px';
    let scaleX = this._zoomedImageWidth / imageWidth;
    let scaleY = this._zoomedImageHeight / imageHeight;
    let posX = this._moveImagePosX ? (-((imagePointerX * scaleX) - (imageWidth / 2))) + 'px' : (this._zoomedImageWidth === imageWidth) ? '0px' : this.zoomContainer.el.style.backgroundPositionX;
    let posY = this._moveImagePosY ? (-((imagePointerY * scaleY) - (imageHeight / 2))) + 'px' : (this._zoomedImageHeight === imageHeight) ? '0px' : this.zoomContainer.el.style.backgroundPositionY;
    backgroundPos = posX + ' ' + posY + '';
    return backgroundPos;
  }


  ngOnChanges(changes: SimpleChanges) {
    this.imageChanged();
  }
}
