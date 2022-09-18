import {Column, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

export class StoreEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    address: string;

    @ManyToMany(() => StoreEntity, store => store.products)
    products: StoreEntity[];
}
