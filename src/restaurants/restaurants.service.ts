import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Query } from 'express-serve-static-core';
import ApiFeatures from '../utils/api-features.util';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>) { }

    // Get all Restuarants
    async findAll(query: Query): Promise<Restaurant[]> {

        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};

        const resPerPage = Number(query.pageSize) || 2;
        const currentPage = Number(query.pageNumber) || 1;
        const skip = resPerPage * (currentPage - 1);

        const restaurants = await this.restaurantModel.find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);

        return restaurants;
    }

    async create(restaurant: Restaurant, user: User): Promise<Restaurant> {
        const location = await ApiFeatures.getRestaurantLocation(restaurant.address);
        const data = Object.assign(restaurant, { user: user._id, location });
        const res = await this.restaurantModel.create(restaurant);
        return res;
    }

    async findById(id: string): Promise<Restaurant> {

        const isValidId = mongoose.isValidObjectId(id); // validates the mongoose id

        if (!isValidId)
            throw new BadRequestException('Wrong mongoose Id, please enter correct id');

        const restaurant = await this.restaurantModel.findById(id);

        if (!restaurant)
            throw new NotFoundException('Restaurant not found.');

        return restaurant;
    }

    async updateById(id: string, restaurant: Restaurant): Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndDelete(id);
    }

    async uploadImages(id: string, files: Array<Express.Multer.File>) {
        const images = await ApiFeatures.upload(files);

        const restaurant = await this.restaurantModel.findByIdAndUpdate(id, {
            images: images as Object[],
        },
            {
                new: true,
                runValidators: true
            })

        return restaurant;
    }

    async deleteImages(images) {
        if (images.length === 0)
            return true;
        return await ApiFeatures.deleteImages(images);
    }
}
