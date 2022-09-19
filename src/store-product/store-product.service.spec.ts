import {Test, TestingModule} from '@nestjs/testing';
import {StoreProductService} from './store-product.service';
import {Repository} from "typeorm";
import {StoreEntity} from "../store/store.entity";
import {ProductEntity} from "../product/product.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {faker} from "@faker-js/faker";
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";

describe('StoreProductService', () => {
    let service: StoreProductService;
    let storeRepository: Repository<StoreEntity>;
    let productRepository: Repository<ProductEntity>;
    let product: ProductEntity;
    let storesList: StoreEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [StoreProductService],
        }).compile();

        service = module.get<StoreProductService>(StoreProductService);
        productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
        storeRepository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));

        await seedDatabase();

    });
    const seedDatabase = async () => {
        productRepository.clear();
        storeRepository.clear();

        storesList = [];
        for (let i = 0; i < 5; i++) {
            const store: StoreEntity = await storeRepository.save({
                name: faker.company.name(),
                city: "BOG",
                address: faker.address.streetAddress()
            })
            storesList.push(store);
        }

        product = await productRepository.save({
            name: faker.commerce.product(),
            price: Number(faker.finance.amount()),
            type: "Perecedero",
            stores: storesList
        })
    }
    it('addStoreToProduct should add an store to a product', async () => {
        const newStore: StoreEntity = await storeRepository.save({
            name: faker.company.name(),
            city: "BOG",
            address: faker.address.streetAddress()
        });

        const newProduct: ProductEntity = await productRepository.save({
            name: faker.commerce.product(),
            price: Number(faker.finance.amount()),
            type: "Perecedero"
        })

        const result: ProductEntity = await service.addStoreToProduct(newStore.id, newProduct.id);

        expect(result.stores.length).toBe(1);
        expect(result.stores[0]).not.toBeNull();
        expect(result.stores[0].name).toBe(newStore.name)
        expect(result.stores[0].city).toBe(newStore.city)
        expect(result.stores[0].address).toBe(newStore.address)

    });

    it('addStoreToProduct should thrown exception for an invalid product', async () => {
        const newStore: StoreEntity = await storeRepository.save({
            name: faker.company.name(),
            city: "BOG",
            address: faker.address.streetAddress()
        });

        await expect(() => service.addStoreToProduct(newStore.id, "0")).rejects.toHaveProperty("message", "The product with the given id was not found");
    });

    it('addStoreToProduct should thrown exception for an invalid store', async () => {
        const newProduct: ProductEntity = await productRepository.save({
            name: faker.commerce.product(),
            price: Number(faker.finance.amount()),
            type: "Perecedero",
            stores: storesList
        })

        await expect(() => service.addStoreToProduct("0", newProduct.id)).rejects.toHaveProperty("message", "The store with the given id was not found");
    });

    it('findStoresFromProduct should return stores by product', async () => {
        const stores: StoreEntity[] = await service.findStoresFromProduct(product.id);
        expect(stores.length).toBe(5)
    });


    it('findStoreFromProduct should return store by product', async () => {
        const store: StoreEntity = storesList[0];
        const storedStore: StoreEntity = await service.findStoreFromProduct(store.id, product.id)
        expect(storedStore).not.toBeNull();
        expect(storedStore.name).toBe(store.name)
        expect(storedStore.city).toBe(store.city)
        expect(storedStore.address).toBe(store.address)
    });

    it('findStoreFromProduct should throw an exception for an invalid product', async () => {
        await expect(() => service.findStoreFromProduct(storesList[0].id, "0")).rejects.toHaveProperty("message", "The product with the given id was not found");
    });

    it('findStoreFromProduct should throw an exception for an invalid store', async () => {
        await expect(() => service.findStoreFromProduct("0", product.id)).rejects.toHaveProperty("message", "The store with the given id was not found");
    });

    it('updateStoresFromProduct should update stores list for a product', async () => {
        const newStore: StoreEntity = await storeRepository.save({
            name: faker.company.name(),
            city: "BOG",
            address: faker.address.streetAddress()
        });

        const updateProduct: ProductEntity = await service.updateStoresFromProduct(product.id, [newStore]);
        expect(updateProduct.stores.length).toBe(1);
        expect(updateProduct.stores[0].name).toBe(newStore.name)
        expect(updateProduct.stores[0].city).toBe(newStore.city)
        expect(updateProduct.stores[0].address).toBe(newStore.address)
    });

    it('deleteStoreFromProduct should remove an store from a product', async () => {
        const store: StoreEntity = storesList[0];

        await service.deleteStoreFromProduct(store.id, product.id);

        const storedProduct: ProductEntity = await productRepository.findOne({
            where: {id: product.id},
            relations: ["stores"]
        });
        const deletedStore: StoreEntity = storedProduct.stores.find(a => a.id === store.id);

        expect(deletedStore).toBeUndefined();

    });

    it('deleteStoreFromProduct should thrown an exception for an invalid product', async () => {
        await expect(() => service.deleteStoreFromProduct(storesList[0].id, "0")).rejects.toHaveProperty("message", "The product with the given id was not found");
    });

    it('deleteStoreFromProduct should thrown an exception for an invalid store', async () => {
        await expect(() => service.deleteStoreFromProduct("0", product.id)).rejects.toHaveProperty("message", "The store with the given id was not found");
    });

    it('deleteStoreFromProduct should thrown an exception for an non asocciated product', async () => {
        const newProduct: ProductEntity = await productRepository.save({
            name: faker.commerce.product(),
            price: Number(faker.finance.amount()),
            type: "Perecedero"
        })

        await expect(()=> service.deleteStoreFromProduct(storesList[0].id, newProduct.id)).rejects.toHaveProperty("message", "The product with the given id is not associated to the store");
    });
});
