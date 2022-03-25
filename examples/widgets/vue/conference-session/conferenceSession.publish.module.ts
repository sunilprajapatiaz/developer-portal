import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { ConferenceSession } from "./design/conferenceSession";
import { ConferenceSessionModelBinder } from "./conferenceSessionModelBinder";
import { ConferenceSessionViewModelBinder } from "./conferenceSessionViewModelBinder";


export class ConferenceSessionPublishModule implements IInjectorModule {
    public register(injector: IInjector): void {        
        injector.bind("conferenceSession", ConferenceSession);
        injector.bindToCollection("modelBinders", ConferenceSessionModelBinder);
        injector.bindToCollection("viewModelBinders", ConferenceSessionViewModelBinder);
    }
}