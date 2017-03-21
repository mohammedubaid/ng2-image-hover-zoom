import { NgModule, ModuleWithProviders } from "@angular/core";
import { ImageZoomDirective } from './image-zoom/image-zoom.directive';
import { ImageZoomContainer } from './image-zoom/image-zoom-container.component';
import { ZoomLensContainer } from './image-zoom/zoom-lens-container.component';

export * from './image-zoom/image-zoom.directive';
export * from './image-zoom/image-zoom-container.component';
export * from './image-zoom/zoom-lens-container.component';

@NgModule({
    declarations: [ ImageZoomContainer, ImageZoomDirective, ZoomLensContainer ],
    exports: [ ImageZoomDirective ],
    entryComponents: [ImageZoomContainer, ZoomLensContainer ]
})
export class ImageZoomModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ImageZoomModule,
        };
    }
}