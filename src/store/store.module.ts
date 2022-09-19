import {Module} from '@nestjs/common';
import {StoreService} from './store.service';
import {StoreEntity} from "./store.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { StoreController } from './store.controller';

@Module({
    providers: [StoreService],
    imports: [TypeOrmModule.forFeature([StoreEntity])],
    controllers: [StoreController],

})
export class StoreModule {
}
