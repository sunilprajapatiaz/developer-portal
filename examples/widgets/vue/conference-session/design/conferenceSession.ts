import Vue from "vue";
import template from "./conferenceSession.html";
import { Component } from "@paperbits/vue/decorators";


@Component({
    selector: "conference-session",
    template: template
})
export class ConferenceSession {
    public sessionNumber: number;

    constructor() {
        this.sessionNumber = 107;
    }
}
