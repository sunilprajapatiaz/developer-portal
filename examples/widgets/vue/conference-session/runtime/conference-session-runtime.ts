import Vue from "vue";
import { widgetRuntimeSelector } from "../constants";

const conferenceApiUrl = "https://conferenceapi.azurewebsites.net/session";

export default Vue.component(widgetRuntimeSelector, {
    data: () => {
        return {
            sessionDescription: null as String
        }
    },

    props: {
        sessionNumber: {
            type: Number,
            default: 107
        }
    },

    methods: {
        async loadSession(sessionNumber: number): Promise<void> {
            const response = await fetch(`${conferenceApiUrl}/${sessionNumber}`);
            this.sessionDescription = await response.text();
        }
    },

    async mounted(): Promise<void> {
        this.loadSession(this.sessionNumber);
    },

    watch: {
        async sessionNumber(sessionNumber: number): Promise<void> {
            this.loadSession(sessionNumber)
        }
    }
});
