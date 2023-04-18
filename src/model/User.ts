import { Table, Column, Model, HasMany, PrimaryKey } from 'sequelize-typescript'

@Table({tableName: 'users_configurations'})
export class User extends Model {
    
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;
    
    @Column
    firstname: string

    @Column
    lastname: string

    @Column
    email: string

    @Column
    password: string
}