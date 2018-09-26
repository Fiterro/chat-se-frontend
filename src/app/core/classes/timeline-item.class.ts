import { TimelineElem } from "../../shared/timeline/timeline.interface";
import { Participant } from "../types/participant.type";
import { TimelineData } from "../types/timeline-data.type";

export class TimelineItem implements TimelineElem {
    timestamp: string;
    participants: Participant[];

    constructor(data: TimelineData) {
        this.timestamp = data.timestamp;
        this.participants = data.participants;
    }
}
