import { $authHost } from ".";
import {ResponseWithMessage} from "../utils/dto/responseWithMessage";
import { ChatResponse } from "../commonComponents/interfaces/Chat/ChatResponse"

export const getChats = async (): Promise<ResponseWithMessage<ChatResponse>> => {
    const response = await $authHost.get(`api/Chat/GetChats`);

    if (response.status !== 200) {
        return new ResponseWithMessage(
            response.status,
            `Ошибка на сервере ${response.data.title}`
        );
    }
    
    return new ResponseWithMessage(response.status, '', response.data);
}