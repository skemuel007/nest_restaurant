import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from '../../auth/schemas/user.schema';
import mongoose from "mongoose";

@Schema()
export class Location {

    @Prop({ type: String, enum: ['Point'] })
    type: string;

    @Prop({ index: '2dsphere' })
    coordinates: Number[];

    formattedAddress: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
}

@Schema()
export class Restaurant {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    email: string;

    @Prop()
    phoneNo: string;

    @Prop()
    address: string;

    @Prop()
    category: Category;

    @Prop()
    images?: object[]

    @Prop({ type: Object, ref: 'Location' })
    location?: Location;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

}

export enum Category {
    FAST_FOOD = 'Fast Food',
    CAFE = 'Cafe',
    FINE_DINNING = 'Fine Dinning'
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);