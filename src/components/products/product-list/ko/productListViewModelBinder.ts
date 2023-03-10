import { Bag } from "@paperbits/common";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { EventManager, Events } from "@paperbits/common/events";
import { ProductListViewModel } from "./productListViewModel";
import { ProductListModel } from "../productListModel";
import { ComponentFlow } from "@paperbits/common/editing";


export class ProductListViewModelBinder implements ViewModelBinder<ProductListModel, ProductListViewModel> {
    constructor(private readonly eventManager: EventManager) { }
    
    public async modelToViewModel(model: ProductListModel, viewModel?: ProductListViewModel, bindingContext?: Bag<any>): Promise<ProductListViewModel> {
        if (!viewModel) {
            viewModel = new ProductListViewModel();
        }

        viewModel.layout(model.layout);

        viewModel.runtimeConfig(JSON.stringify({
            allowSelection: model.allowSelection,
            detailsPageUrl: model.detailsPageHyperlink
                ? model.detailsPageHyperlink.href
                : undefined
        }));


        viewModel["widgetBinding"] = {
            displayName: "List of products" + (model.layout === "list" ? "" : ` (${model.layout})`),
            layer: bindingContext?.layer,
            model: model,
            draggable: true,
            flow: ComponentFlow.Block,
            editor: "product-list-editor",
            applyChanges: async (updatedModel: ProductListModel) => {
                await this.modelToViewModel(updatedModel, viewModel, bindingContext);
                this.eventManager.dispatchEvent(Events.ContentUpdate);
            }
        };

        return viewModel;
    }

    public canHandleModel(model: ProductListModel): boolean {
        return model instanceof ProductListModel;
    }
}