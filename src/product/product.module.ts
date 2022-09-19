import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "./product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [],
  providers: [ProductService],
})
export class ProductModule {}
