import { EventManager } from "@paperbits/common/events";
import { AccessToken } from "./../../authentication/accessToken";
import template from "./app.html";
import { ViewManager } from "@paperbits/common/ui";
import { Component, OnMounted } from "@paperbits/common/ko/decorators";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { ISiteService } from "@paperbits/common/sites";
import { IAuthenticator } from "../../authentication";
import { Bag } from "@paperbits/common";
import { AzureResourceManagementService } from "../../services/armService";
import { SessionManager } from "@paperbits/common/persistence/sessionManager";
import { DeveloperPortalType, SettingNames, WarningBackendUrlMissing } from "../../constants";

const startupError = `Unable to start the portal`;

@Component({
    selector: "app",
    template: template
})
export class App {
    constructor(
        private readonly settingsProvider: ISettingsProvider,
        private readonly authenticator: IAuthenticator,
        private readonly viewManager: ViewManager,
        private readonly eventManager: EventManager,
        private readonly siteService: ISiteService,
        private readonly armService: AzureResourceManagementService,
        private readonly sessionManager: SessionManager
    ) { }

    private async getRuntimeSettings(): Promise<Bag<string>> {
        const serviceDescription = await this.armService.getServiceDescription();

        const userId = "1";
        const userTokenValue = await this.armService.getUserAccessToken(userId);

        return {
            managementApiUrl: serviceDescription.properties.managementApiUrl,
            managementApiAccessToken: userTokenValue
        };
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        const settings = await this.settingsProvider.getSettings();

        const subscriptionId = settings["subscriptionId"];
        const resourceGroupName = settings[SettingNames.resourceGroupName];
        const serviceName = settings[SettingNames.serviceName];
        const armEndpoint = settings[SettingNames.armEndpoint] || "management.azure.com";

        if (subscriptionId && resourceGroupName && serviceName) {
            const managementApiUrl = `https://${armEndpoint}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ApiManagement/service/${serviceName}`;
            await this.settingsProvider.setSetting(SettingNames.managementApiUrl, managementApiUrl);
            await this.settingsProvider.setSetting(SettingNames.backendUrl, `https://${serviceName}.developer.azure-api/net`);
        }

        const runtimeSettings = await this.getRuntimeSettings();
        this.sessionManager.setItem("designTimeSettings", runtimeSettings);
        this.viewManager.setHost({ name: "page-host" });
        this.viewManager.showToolboxes();


        if (!settings[SettingNames.managementApiUrl]) {
            this.viewManager.addToast(startupError, `Management API URL is missing. See setting <i>managementApiUrl</i> in the configuration file <i>config.design.json</i>`);
            return;
        }

        if (!settings["backendUrl"]) {
            const developerPortalType = settings[SettingNames.developerPortalType] || DeveloperPortalType.selfHosted;
            if (developerPortalType === DeveloperPortalType.selfHosted) {
                this.viewManager.addToast("Warning", WarningBackendUrlMissing);
            }            
        }

        try {
            const token = await this.authenticator.getAccessTokenAsString();

            if (!token) {
                const managementApiAccessToken = settings["managementApiAccessToken"];

                if (!managementApiAccessToken) {
                    this.viewManager.addToast(startupError, `Management API access token is missing. See setting <i>managementApiAccessToken</i> in the configuration file <i>config.design.json</i>`);
                    return;
                }

                const accessToken = AccessToken.parse(managementApiAccessToken);
                const now = new Date();

                if (now >= accessToken.expires) {
                    this.viewManager.addToast(startupError, `Management API access token has expired. See setting <i>managementApiAccessToken</i> in the configuration file <i>config.design.json</i>`);
                    this.authenticator.clearAccessToken();
                    return;
                }

                await this.authenticator.setAccessToken(accessToken);
            }
        }
        catch (error) {
            this.viewManager.addToast(startupError, error);
            return;
        }

        try {
            /* Checking if settings were created, and if not, we consider the portal not initialized and launch setup dialog. */

            const siteSettings = await this.siteService.getSettings<any>();

            if (!siteSettings) {
                this.viewManager.setHost({ name: "setup-dialog" });
                return;
            }

            this.viewManager.setHost({ name: "page-host" });
            this.viewManager.showToolboxes();

            setTimeout(() => this.eventManager.dispatchEvent("displayHint", {
                key: "a69b",
                content: `When you're in the administrative view, you still can navigate any website hyperlink by clicking on it holding Ctrl (Windows) or ??? (Mac) key.`
            }), 5000);
        }
        catch (error) {
            this.viewManager.addToast(startupError, `Check if the settings specified in the configuration file <i>config.design.json</i> are correct or refer to the <a href="http://aka.ms/apimdocs/portal#faq" target="_blank">frequently asked questions</a>.`);
        }
    }
}