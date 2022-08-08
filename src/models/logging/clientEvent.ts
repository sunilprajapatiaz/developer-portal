export class ClientEvent {
    /**
     * Event type.
     */
    public eventType: string;

    /**
     * Event message.
     */
    public message: string;

    /**
     * Payload of event data.
     */
    public eventData: object;

    /**
     * ISO representation of current time, e.g. `2022-01-01T00:00:00.000Z`.
     */
    public timestamp: string;

    /**
     * uuidv4 value.
     */
    public activityId: string;
}