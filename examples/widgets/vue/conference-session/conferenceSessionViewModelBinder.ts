import { Bag } from "@paperbits/common";
import { EventManager, Events } from "@paperbits/common/events";
import { ComponentFlow, IWidgetBinding, WidgetBinding } from "@paperbits/common/editing";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ConferenceSession } from "./design/conferenceSession";
import { widgetName, widgetDisplayName, widgetEditorSelector } from "./constants";
import { ConferenceSessionModel } from "./conferenceSessionModel";


export class ConferenceSessionViewModelBinder implements ViewModelBinder<ConferenceSessionModel, ConferenceSession>  {
    constructor(private readonly eventManager: EventManager) { }

    // public async updateViewModel(model: ConferenceSessionModel, viewModel: ConferenceSession): Promise<void> {
    //     viewModel.runtimeConfig({ sessionNumber: model.sessionNumber });
    // }

    // public async modelToViewModel(model: ConferenceSessionModel, viewModel?: ConferenceSession, bindingContext?: Bag<any>): Promise<ConferenceSession> {
    //     if (!viewModel) {
    //         viewModel = new ConferenceSession();

    //         const binding: IWidgetBinding<ConferenceSessionModel, ConferenceSession> = {
    //             name: widgetName,
    //             displayName: widgetDisplayName,
    //             readonly: bindingContext?.readonly,
    //             model: model,
    //             draggable: true,
    //             flow: ComponentFlow.Block,
    //             editor: widgetEditorSelector,
    //             applyChanges: async () => {
    //                 await this.updateViewModel(model, viewModel);
    //                 this.eventManager.dispatchEvent(Events.ContentUpdate);
    //             }
    //         };
    //         viewModel["widgetBinding"] = binding;
    //     }

    //     this.updateViewModel(model, viewModel);

    //     return viewModel;
    // }

    public async createWidgetBinding(model: ConferenceSessionModel, bindingContext: Bag<any>): Promise<WidgetBinding<ConferenceSessionModel, ConferenceSession>> {
        const binding = new WidgetBinding<ConferenceSessionModel, ConferenceSession>();
        binding.framework = "vue";
        binding.model = model;
        binding.name = widgetName;
        binding.displayName = widgetDisplayName;
        binding.editor = widgetEditorSelector;
        binding.readonly = false;
        binding.flow = ComponentFlow.Block;
        binding.draggable = true;
        binding.viewModelClass = ConferenceSession;
        binding.applyChanges = async () => {
            await this.modelToViewModel(model, binding.viewModel, bindingContext);
            this.eventManager.dispatchEvent("onContentUpdate");
        };
        binding.onCreate = async () => {
            await this.modelToViewModel(model, binding.viewModel, bindingContext);
        };

        return binding;
    }

    public async modelToViewModel(model: ConferenceSessionModel, viewModel: ConferenceSession, bindingContext?: Bag<any>): Promise<ConferenceSession> {
        viewModel.sessionNumber = model.sessionNumber;
        return viewModel;
    }

    public canHandleModel(model: ConferenceSessionModel): boolean {
        return model instanceof ConferenceSessionModel;
    }
}