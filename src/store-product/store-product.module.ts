import {Module} from '@nestjs/common';
import {StoreProductService} from './store-product.service';
import {ProductEntity} from "../product/product.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StoreEntity} from "../store/store.entity";

@Module({
    providers: [StoreProductService],
    imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],

})
export class StoreProductModule {
}
