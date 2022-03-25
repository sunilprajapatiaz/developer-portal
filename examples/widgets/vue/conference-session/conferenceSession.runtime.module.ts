import { IInjector, IInjectorModule } from "@paperbits/common/injection";
import ConferenceSessionRuntime from "./runtime/conference-session-runtime.vue";
import { registerCustomElement } from "@paperbits/vue/utils";


export class ConferenceSessionRuntimeModule implements IInjectorModule {
    public register(injector: IInjector): void {
        registerCustomElement(ConferenceSessionRuntime, "conference-session-runtime");
    }
}