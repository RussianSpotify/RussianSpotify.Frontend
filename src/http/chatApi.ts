import { $authHost } from ".";
import {ResponseWithMessage} from "../utils/dto/responseWithMessage";

export const getChats = async () => {
    const response = await $authHost.get(`api/Chat/GetChats`);

    if (response.status !== 200) {
        return new ResponseWithMessage(
            response.status,
            `Ошибка на сервере ${response.data.title}`
        );
    }
    
    return new ResponseWithMessage(response.status, '', response.data);
}

export const getMessagesInChat = async (chatId: string) => {
    const response = await $authHost.get(`api/Chat/${chatId}`);

    if (response.status !== 200) {
        return new ResponseWithMessage(
            response.status,
            `Ошибка на сервере ${response.data.title}`
        );
    }

    return new ResponseWithMessage(response.status, '', response.data);
}