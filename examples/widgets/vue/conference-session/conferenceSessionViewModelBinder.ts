import { Bag } from "@paperbits/common";
import { EventManager } from "@paperbits/common/events";
import { ComponentFlow, WidgetBinding } from "@paperbits/common/editing";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ConferenceSession } from "./design/conferenceSession";
import { widgetName, widgetDisplayName, widgetEditorSelector } from "./constants";
import { ConferenceSessionModel } from "./conferenceSessionModel";


export class ConferenceSessionViewModelBinder implements ViewModelBinder<ConferenceSessionModel, ConferenceSession>  {
    constructor(private readonly eventManager: EventManager) { }

    public async createWidgetBinding(model: ConferenceSessionModel): Promise<WidgetBinding<ConferenceSessionModel, ConferenceSession>> {
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
            await this.modelToViewModel(model, binding.viewModel);
            this.eventManager.dispatchEvent("onContentUpdate");
        };
        binding.onCreate = async () => {
            await this.modelToViewModel(model, binding.viewModel);
        };

        return binding;
    }

    public async modelToViewModel(model: ConferenceSessionModel, viewModel: ConferenceSession): Promise<ConferenceSession> {
        viewModel.sessionNumber = model.sessionNumber;
        return viewModel;
    }

    public canHandleModel(model: ConferenceSessionModel): boolean {
        return model instanceof ConferenceSessionModel;
    }
}