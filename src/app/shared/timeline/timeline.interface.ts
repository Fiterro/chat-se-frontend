import { Participant } from "../../core/types/participant.type";

export interface TimelineElem {
    timestamp: string;
    participants: Participant[];
}
