import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {BusinessErrorsInterceptor} from '../shared/interceptors/business-errors.interceptor';
import {StoreProductService} from "./store-product.service";
import {StoreDto} from "../store/store.dto";
import {plainToInstance} from "class-transformer";
import {StoreEntity} from "../store/store.entity";

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreProductController {
    constructor(private readonly storeProductService: StoreProductService) {
    }

    @Post(':productId/stores/:storeId')
    async addStoreToProduct(@Param('productId') productId: string, @Param('storeId') storeId: string) {
        return await this.storeProductService.addStoreToProduct(productId, storeId);
    }

    @Get(':productId/stores')
    async findStoresFromProduct(@Param('productId') productId: string) {
        return await this.storeProductService.findStoresFromProduct(productId);
    }

    @Get(':productId/stores/:storeId')
    async findStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string) {
        return await this.storeProductService.findStoreFromProduct(productId, storeId);
    }

    @Put(':productId/stores')
    async updateStoresFromProduct(@Body() storesDto: StoreDto[], @Param('productId') productId: string) {
        const stores = plainToInstance(StoreEntity, storesDto)
        return await this.storeProductService.updateStoresFromProduct(productId, stores);
    }

    @Delete(':productId/stores/:storeId')
    @HttpCode(204)
    async deleteStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string) {
        return await this.storeProductService.deleteStoreFromProduct(productId, storeId);
    }
}