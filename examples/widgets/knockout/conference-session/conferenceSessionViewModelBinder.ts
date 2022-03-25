import { Bag } from "@paperbits/common";
import { EventManager, Events } from "@paperbits/common/events";
import { ComponentFlow, IWidgetBinding } from "@paperbits/common/editing";
import { ViewModelBinder } from "@paperbits/common/widgets";
import { ConferenceSession } from "./design/conferenceSession";
import { widgetName, widgetDisplayName, widgetEditorSelector } from "./constants";
import { ConferenceSessionModel } from "./conferenceSessionModel";


export class ConferenceSessionViewModelBinder implements ViewModelBinder<ConferenceSessionModel, ConferenceSession>  {
    constructor(private readonly eventManager: EventManager) { }

    public async updateViewModel(model: ConferenceSessionModel, viewModel: ConferenceSession): Promise<void> {
        viewModel.runtimeConfig(JSON.stringify({ sessionNumber: model.sessionNumber }));
    }

    public async modelToViewModel(model: ConferenceSessionModel, viewModel?: ConferenceSession, bindingContext?: Bag<any>): Promise<ConferenceSession> {
        if (!viewModel) {
            viewModel = new ConferenceSession();

            const binding: IWidgetBinding<ConferenceSessionModel, ConferenceSession> = {
                name: widgetName,
                displayName: widgetDisplayName,
                readonly: bindingContext?.readonly,
                model: model,
                draggable: true,
                flow: ComponentFlow.Block,
                editor: widgetEditorSelector,
                applyChanges: async () => {
                    await this.updateViewModel(model, viewModel);
                    this.eventManager.dispatchEvent(Events.ContentUpdate);
                }
            };
            viewModel["widgetBinding"] = binding;
        }

        this.updateViewModel(model, viewModel);

        return viewModel;
    }

    public canHandleModel(model: ConferenceSessionModel): boolean {
        return model instanceof ConferenceSessionModel;
    }
}