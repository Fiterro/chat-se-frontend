import { Directive, EventEmitter, Output, HostListener, ElementRef, Input } from "@angular/core";

@Directive({
    selector: "[appBorderScrolled]"
})
export class BorderScrolledDirective {
    @Input()
    gap = 0;

    @Output()
    appBorderScrolled = new EventEmitter<void>();

    private get nativeElement(): HTMLElement {
        return this.elementRef.nativeElement as HTMLElement;
    }

    private get scrollTop(): number {
        return this.nativeElement.scrollTop;
    }

    constructor(private elementRef: ElementRef) {
    }

    @HostListener("scroll")
    onScroll(): void {
        if (this.scrollTop - +this.gap <= 0) {
            this.appBorderScrolled.emit();
        }
    }
}
