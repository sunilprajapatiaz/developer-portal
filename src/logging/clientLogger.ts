import { Bag } from "@paperbits/common";
import { Logger } from "@paperbits/common/logging";
import { HttpClient, HttpRequest, HttpHeader } from "@paperbits/common/http";
import { ISettingsProvider } from "@paperbits/common/configuration";
import { ClientEvent } from "../models/logging/clientEvent";
import { v4 as uuidv4 } from "uuid";
import * as Constants from "../constants";
import { SessionManager } from "@paperbits/common/persistence/sessionManager";
import { Utils } from "../utils";

const sessionIdToken = "sessionId";

export class ClientLogger implements Logger {
    private clientVersion: string;
    private backendUrl: string;
    private backendUrlSet: boolean = false;
    private sessionId: string;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly settingsProvider: ISettingsProvider,
        private readonly sessionManager: SessionManager
    ) {
        this.clientVersion = process.env.VERSION;
        this.initialize();
    }

    private async initialize(): Promise<void> {
        let sessionId = await this.sessionManager.getItem<string>(sessionIdToken);

        if (!sessionId) {
            sessionId = Utils.getBsonObjectId();
            await this.sessionManager.setItem(sessionIdToken, sessionId);
        }

        this.sessionId = sessionId;
    }

    public async trackSession(properties?: object): Promise<void> {
        // Not implemented
    }

    public async trackEvent(eventName: string, properties?: Bag<string>): Promise<void> {
        const devPortalEvent = new ClientEvent();

        devPortalEvent.eventType = eventName;
        devPortalEvent.message = properties?.message;
        devPortalEvent.eventData = JSON.stringify(properties);

        this.traceEvent(devPortalEvent);
    }

    public async trackError(error: Error, properties?: Bag<string>): Promise<void> {
        const devPortalEvent = new ClientEvent();

        devPortalEvent.eventType = "Error";
        devPortalEvent.message = error.stack || error.message;
        devPortalEvent.eventData = properties;

        this.traceEvent(devPortalEvent);
    }

    public async trackView(viewName: string, properties?: Bag<string>): Promise<void> {
        

        const devPortalEvent = new ClientEvent();

        devPortalEvent.eventType = viewName;
        devPortalEvent.message = properties?.message;
        devPortalEvent.eventData = properties;

        this.traceEvent(devPortalEvent);
    }

    public async trackMetric(metricName: string, properties?: Bag<string>): Promise<void> {
        // Not implemented
    }

    public async trackDependency(name: string, properties?: Bag<string>): Promise<void> {
        // Not implemented
    }

    private async traceEvent(eventType: string, eventData: object, message: string) {
        const datetime = new Date();

        clientEvent.timestamp = datetime.toISOString();
        clientEvent.activityId = uuidv4();
        clientEvent.eventData 

        const developerPortalType = await this.settingsProvider.getSetting<string>(Constants.SettingNames.developerPortalType) || Constants.DeveloperPortalType.selfHosted;

        const headers: HttpHeader[] = [];
        headers.push({ name: "client-version", value: this.clientVersion });
        headers.push({ name: "developer-portal-type", value: developerPortalType });

        const request: HttpRequest = {
            url: await this.getBackendUrl() + `/trace`,
            method: "POST",
            headers: headers,
            body: JSON.stringify(clientEvent)
        };

        this.httpClient.send(request);
    }

    private async getBackendUrl(): Promise<string> {
        if (this.backendUrlSet === false) {
            this.backendUrl = await this.settingsProvider.getSetting<string>(Constants.SettingNames.backendUrl) || "";
            this.backendUrlSet = true;
        }

        return this.backendUrl;
    }
}