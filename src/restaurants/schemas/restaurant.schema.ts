import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Restaurant {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    email: string;

    @Prop()
    phoneNo: number;

    @Prop()
    address: string;

    @Prop()
    category: Category;

    @Prop()
    images?: object[]

}

export enum Category {
    FAST_FOOD = 'Fast Food',
    CAFE = 'Cafe',
    FINE_DINNING = 'Fine Dinning'
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);