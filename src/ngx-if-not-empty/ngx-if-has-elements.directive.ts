import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import isEmpty from 'lodash/isEmpty'

@Directive({
	selector: "[ngxIfNotEmpty][ngxIfHasElements]"
})
export class NgxIfHasElementsDirective {

	private _context: NgxIfNotEmptyContext = new NgxIfNotEmptyContext();
	private _thenTemplateRef: TemplateRef<NgxIfNotEmptyContext> | null = null;
	private _elseTemplateRef: TemplateRef<NgxIfNotEmptyContext> | null = null;
	private _thenViewRef: EmbeddedViewRef<NgxIfNotEmptyContext> | null = null;
	private _elseViewRef: EmbeddedViewRef<NgxIfNotEmptyContext> | null = null;

	constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgxIfNotEmptyContext>) {
		this._thenTemplateRef = templateRef;
	}

	@Input()
	set ngxIsNotEmpty(array: any) {
		this._context.$implicit = this._context.ngIf = !isEmpty(array);
		this._updateView();
	}

	@Input()
	set ngxIsNotEmptyThen(templateRef: TemplateRef<NgxIfNotEmptyContext> | null) {
		assertTemplate("ngxIfNotEmptyThen", templateRef);
		this._thenTemplateRef = templateRef;
		this._thenViewRef = null;  // clear previous view if any.
		this._updateView();
	}

	@Input()
	set ngxIsNotEmptyElse(templateRef: TemplateRef<NgxIfNotEmptyContext> | null) {
		assertTemplate("ngxIfNotEmptyElse", templateRef);
		this._elseTemplateRef = templateRef;
		this._elseViewRef = null;  // clear previous view if any.
		this._updateView();
	}

	@Input()
	set ngxIfHasElementsThen(templateRef: TemplateRef<NgxIfNotEmptyContext> | null) {
		assertTemplate("ngxIfHasElementsThen", templateRef);
		this._thenTemplateRef = templateRef;
		this._thenViewRef = null;  // clear previous view if any.
		this._updateView();
	}

	@Input()
	set ngxIfHasElementsElse(templateRef: TemplateRef<NgxIfNotEmptyContext> | null) {
		assertTemplate("ngxIfHasElementsElse", templateRef);
		this._elseTemplateRef = templateRef;
		this._elseViewRef = null;  // clear previous view if any.
		this._updateView();
	}

	private _updateView() {
		if (this._context.$implicit) {
			if (!this._thenViewRef) {
				this._viewContainer.clear();
				this._elseViewRef = null;
				if (this._thenTemplateRef) {
					this._thenViewRef =
						this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
				}
			}
		} else {
			if (!this._elseViewRef) {
				this._viewContainer.clear();
				this._thenViewRef = null;
				if (this._elseTemplateRef) {
					this._elseViewRef =
						this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
				}
			}
		}
	}
}


export class NgxIfNotEmptyContext {
	public $implicit: any = null;
	public ngIf: any = null;
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
	const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
	if (!isTemplateRefOrNull) {
		throw new Error(`${property} must be a TemplateRef, but received '${(templateRef)}'.`);
	}
}