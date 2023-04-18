import { User } from "../model/User";
import { connect } from "../database/DatabaseConfig";

export class UserRepository {

    private db: any = {};
    private userRepository: any

    constructor() {
        this.db = connect();
        this.db.sequelize.sync({ force: true }).then(() => {
            console.log("Drop and re-sync db.");
        });
        this.userRepository = this.db.sequelize.getRepository(User);
    }

    async returnAllUsersAccounts() {
        const users = await this.userRepository.findAll()
        return users;
    }

    async returnUserAccountById(id: number) {
        return await this.userRepository.findOne({ where: { id: id } });
    }

    async returnUserAccountByEmail(email: String) {
        return await this.userRepository.findOne({ where: { email: email } });
    }

    async registerUser(userData: User) {
        return await this.userRepository.create(userData);
    }

    async updateUserEmail(originalEmail: String, email: String) {
        return await this.userRepository.update({email}, {
            where: {
                email: originalEmail 
            }
        });
    }

    async updateUserPassword(originalEmail: String, password: String) {
        return await this.userRepository.update({password}, {
            where: {
                email: originalEmail 
            }
        });
    }

    async deleteAccount(email: String) {
        return await this.userRepository.destroy({
            where: {
                email: email 
            }
        });
    }

    async validateUserAlreadyExist(email: String) {
        return await this.userRepository.findOne({ where: { email: email } });
    }
}