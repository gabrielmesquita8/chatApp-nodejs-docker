import { DataTypes } from 'sequelize';
import { Table, Column, Model, HasMany, PrimaryKey } from 'sequelize-typescript'

@Table({tableName: 'users_configurations'})
export class User extends Model {
    
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;
    
    @Column({type: DataTypes.STRING, allowNull: false})
    firstname: string

    @Column({type: DataTypes.STRING, allowNull: false})
    lastname: string

    @Column({type: DataTypes.STRING, allowNull: false})
    email: string

    @Column({allowNull: false})
    password: string
}