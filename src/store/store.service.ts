import {Injectable} from '@nestjs/common';
import {StoreEntity} from "./store.entity";
import {BusinessError, BusinessLogicException} from "../shared/errors/business-errors";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>
    ) {
    }

    validCityCode(store: StoreEntity): boolean {
        let valid_codes = ['SMR', 'BOG', 'MED']
        return valid_codes.includes(store.city.toUpperCase());
    }

    async findAll(): Promise<StoreEntity[]> {
        return await this.storeRepository.find({relations: ["products"]});
    }

    async findOne(id: string): Promise<StoreEntity> {
        const store: StoreEntity = await this.storeRepository.findOne({where: {id}, relations: ["products"]});
        if (!store)
            throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND);
        return store;
    }

    async create(store: StoreEntity): Promise<StoreEntity> {
        if (!this.validCityCode(store))
            throw new BusinessLogicException("The store city is not valid", BusinessError.PRECONDITION_FAILED);
        return await this.storeRepository.save(store);
    }

    async update(id: string, store: StoreEntity): Promise<StoreEntity> {
        const persistedProduct: StoreEntity = await this.storeRepository.findOne({where: {id}});
        if (!persistedProduct)
            throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND);
        if (!this.validCityCode(store))
            throw new BusinessLogicException("The store city is not valid", BusinessError.PRECONDITION_FAILED);
        return await this.storeRepository.save({...persistedProduct, ...store})
    }

    async delete(id: string) {
        const store: StoreEntity = await this.storeRepository.findOne({where: {id}});
        if (!store)
            throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND);
        await this.storeRepository.remove(store);
    }
}
