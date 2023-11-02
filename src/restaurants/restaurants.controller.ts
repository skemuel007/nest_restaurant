import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private restaurantService: RestaurantsService) { }

    @Get()
    async getAllRestuarants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
        return this.restaurantService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin', 'user')
    async create(
        @Body() restaurant: CreateRestaurantDto,
        @CurrentUser() user: User): Promise<Restaurant> {

        return this.restaurantService.create(restaurant, user);
    }

    @Get(':id')
    async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
        return this.restaurantService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateRestaurant(
        @Param('id') id: string,
        @Body() restaurant: UpdateRestaurantDto,
        @CurrentUser() user: User
    ): Promise<Restaurant> {

        const res = await this.restaurantService.findById(id);
        if (res.user.toString() !== user._id.toString())
            throw new ForbiddenException('You can not update this restaurant.');

        return this.restaurantService.updateById(id, restaurant);
    }

    @Delete(':id')
    async deleteRestaurant(
        @Param('id') id: string
    ): Promise<{ deleted: Boolean }> {

        const restaurant = await this.restaurantService.findById(id);

        const isDeleted = await this.restaurantService.deleteImages(restaurant.images)
        if (isDeleted) {
            this.restaurantService.deleteById(id);
            return { deleted: true };
        } else {
            return { deleted: false };
        }

        throw new NotFoundException('Restaurant not found!');
    }

    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {

        await this.restaurantService.findById(id);

        const res = await this.restaurantService.uploadImages(id, files);
        // console.log(id);
        // console.log(files);
        return res;
    }
}
