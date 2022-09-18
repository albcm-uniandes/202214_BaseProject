import {Module} from '@nestjs/common';
import {StoreService} from './store.service';
import {StoreEntity} from "./store.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    providers: [StoreService],
    imports: [TypeOrmModule.forFeature([StoreEntity])],

})
export class StoreModule {
}
