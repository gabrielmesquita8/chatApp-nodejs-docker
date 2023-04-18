import { Sequelize } from 'sequelize-typescript'
import { User } from '../model/User';
require('dotenv').config();

export const connect = () => {
    const hostName = String(process.env.POSTGRES_HOST);
    const userName = String(process.env.POSTGRES_USER);
    const password = String(process.env.POSTGRES_PASSWORD);
    const database = String(process.env.POSTGRES_DB);
    const port = Number(process.env.POSTGRES_PORT)
    const dialect = 'postgres'

    const sequelize = new Sequelize({
        host: hostName,
        dialect,
        port: port,
        username: userName, 
        password: password,
        database: database,
        repositoryMode: true,
        pool: {
            max: 10000,
            min: 0,
            acquire: 1000000,
            idle: 200000
        }
    });

    sequelize.addModels([User])
    
    const db: any = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    
    return db;
}