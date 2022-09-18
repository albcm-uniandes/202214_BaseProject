import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "./product.entity";
import {Repository} from "typeorm";
import {BusinessError, BusinessLogicException} from "../shared/errors/business-errors";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {}

    validProductType(product: ProductEntity): boolean{
        return product.type.toUpperCase() == "PERECEDERO" || product.type.toUpperCase() == "NO PERECEDERO";
    }


    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find({relations: ["stores"]});
    }

    async findOne(id: string): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: {id}, relations: ["stores"]});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        return product;
    }

    async create(product: ProductEntity): Promise<ProductEntity> {
        if (!this.validProductType(product))
            throw new BusinessLogicException("The product type is not valid", BusinessError.PRECONDITION_FAILED);
        return await this.productRepository.save(product);
    }

    async update(id: string, product: ProductEntity): Promise<ProductEntity> {
        const persistedProduct: ProductEntity = await this.productRepository.findOne({where: {id}});
        if (!persistedProduct)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        if (!this.validProductType(product))
            throw new BusinessLogicException("The product type is not valid", BusinessError.PRECONDITION_FAILED);
        return await this.productRepository.save({...persistedProduct, ...product})
    }

    async delete(id: string) {
        const product: ProductEntity = await this.productRepository.findOne({where: {id}});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
        await this.productRepository.remove(product);
    }

}
