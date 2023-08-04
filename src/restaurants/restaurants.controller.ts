import { Controller, Get } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private restaurantService: RestaurantsService) { }

    @Get()
    async getAllRestuarants(): Promise<Restaurant[]> {
        return this.restaurantService.findAll();
    }
}
