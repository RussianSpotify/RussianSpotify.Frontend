export default class MakeSubscriptionDto {
    subscribeLength: number;

    constructor(subscriptionLength: number) {
        if (subscriptionLength !== parseInt(subscriptionLength.toString()))
            throw new Error("Could not parse subscription length");

        this.subscribeLength = subscriptionLength;
    }

}