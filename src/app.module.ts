import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProductModule} from './product/product.module';
import {StoreModule} from './store/store.module';
import {StoreProductModule} from './store-product/store-product.module';
import {StoreEntity} from "./store/store.entity";
import {ProductEntity} from "./product/product.entity";
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [ProductModule, StoreModule, StoreProductModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'root',
            password: 'root',
            database: 'products',
            entities: [StoreEntity, ProductEntity],
            dropSchema: true,
            synchronize: true,
            keepConnectionAlive: true
        })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
