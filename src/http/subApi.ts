import {$authHost, $authSubscribe} from "./index";
import MakeSubscriptionDto from "../utils/dto/subscription/makeSubscriptionDto";
import GetSubscriptionDto from "../utils/dto/subscription/getSubscriptionDto";


export const subscribe = async (makeSubscriptionDto: MakeSubscriptionDto) => {
    const response = await $authSubscribe.post("api/Subscribe/subscribe/", makeSubscriptionDto)
    return response.status === 200
}

export const getSubscription = async () => {
    const response = await $authSubscribe.get("api/Subscribe/getSubscribeInfo")
    let data = response.data
    return response.status !== 200
        ? new GetSubscriptionDto()
        : GetSubscriptionDto.init(data.startDate, data.endDate)
}