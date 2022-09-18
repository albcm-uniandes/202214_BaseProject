import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "./product.entity";

@Module({
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([ProductEntity])],
})
export class ProductModule {}
