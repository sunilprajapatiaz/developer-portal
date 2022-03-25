import Vue from "vue";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ConferenceSession } from "./design/conferenceSession";
import { ConferenceSessionEditor } from "./design/conferenceSessionEditor";
import { ConferenceSessionHandlers } from "./conferenceSessionHandlers";
import { ConferenceSessionModelBinder } from "./conferenceSessionModelBinder";
import { ConferenceSessionViewModelBinder } from "./";
import { widgetRuntimeSelector } from "./constants";


export class ConferenceSessionDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("conferenceSession", ConferenceSession);
        injector.bind("conferenceSessionEditor", ConferenceSessionEditor);
        injector.bindToCollection("modelBinders", ConferenceSessionModelBinder);
        injector.bindToCollection("viewModelBinders", ConferenceSessionViewModelBinder);
        injector.bindToCollection("widgetHandlers", ConferenceSessionHandlers);

        Vue.config.ignoredElements.push(widgetRuntimeSelector);
    }
}