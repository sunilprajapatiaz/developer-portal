import { Bag } from "@paperbits/common";
import { EventManager, Events } from "@paperbits/common/events";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ProductApisViewModel } from "./productApisViewModel";
import { ProductApisModel } from "../productApisModel";
import { ComponentFlow } from "@paperbits/common/editing";

export class ProductApisViewModelBinder implements ViewModelBinder<ProductApisModel, ProductApisViewModel> {
    constructor(private readonly eventManager: EventManager) { }
    
    public async modelToViewModel(model: ProductApisModel, viewModel?: ProductApisViewModel, bindingContext?: Bag<any>): Promise<ProductApisViewModel> {
        if (!viewModel) {
            viewModel = new ProductApisViewModel();
        }

        viewModel.layout(model.layout);

        viewModel.runtimeConfig(JSON.stringify({
            detailsPageUrl: model.detailsPageHyperlink
                ? model.detailsPageHyperlink.href
                : undefined
        }));

        viewModel["widgetBinding"] = {
            displayName: "Product: APIs" + (model.layout === "list" ? "" : ` (${model.layout})`),
            layer: bindingContext?.layer,
            model: model,
            draggable: true,
            flow: ComponentFlow.Block,
            editor: "product-apis-editor",
            applyChanges: async (updatedModel: ProductApisModel) => {
                await this.modelToViewModel(updatedModel, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ProductApisModel): boolean {
        return model instanceof ProductApisModel;
    }
}