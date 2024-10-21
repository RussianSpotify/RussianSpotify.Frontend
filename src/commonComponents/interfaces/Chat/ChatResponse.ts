import { ChatItemResponse } from "../Chat/ChatItemResponse";

export interface ChatResponse {
    entities: ChatItemResponse[];
    totalCount: number;
}