import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {BusinessErrorsInterceptor} from "../shared/interceptors/business-errors.interceptor";
import {plainToInstance} from "class-transformer";
import {StoreService} from "./store.service";
import {StoreEntity} from "./store.entity";
import {StoreDto} from "./store.dto";

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get()
    async findAll() {
        return await this.storeService.findAll();
    }

    @Get(':storeId')
    async findOne(@Param('storeId') storeId: string) {
        return await this.storeService.findOne(storeId);
    }

    @Post()
    async create(@Body() storeDto: StoreDto) {
        const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
        return await this.storeService.create(store);
    }

    @Put(':storeId')
    async update(@Param('storeId') storeId: string, @Body() storeDto: StoreDto) {
        const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
        return await this.storeService.update(storeId, store);
    }

    @Delete(':storeId')
    @HttpCode(204)
    async delete(@Param('storeId') storeId: string) {
        return await this.storeService.delete(storeId);
    }
}
