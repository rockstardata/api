"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const sync_service_1 = require("../database/sync.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepository;
    syncService;
    constructor(userRepository, syncService) {
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createUserDto) {
        const { password, ...userData } = createUserDto;
        const user = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync(password, 10),
        });
        const savedUser = await this.userRepository.save(user);
        this.syncService.syncEntity('User', 'create', savedUser).catch(error => {
            console.error('Failed to sync user creation to external DB:', error);
        });
        return savedUser;
    }
    findAll() {
        return this.userRepository.find();
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                organizationUsers: {
                    role: true,
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }
    async findOneByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            relations: {
                organizationUsers: {
                    role: true,
                },
            },
        });
    }
    async update(id, updateUserDto) {
        await this.userRepository.update(id, updateUserDto);
        const updatedUser = await this.userRepository.findOne({ where: { id } });
        this.syncService.syncEntity('User', 'update', updatedUser).catch(error => {
            console.error('Failed to sync user update to external DB:', error);
        });
        return updatedUser;
    }
    async remove(id) {
        await this.userRepository.delete(id);
        this.syncService.syncEntity('User', 'delete', { id }).catch(error => {
            console.error('Failed to sync user deletion to external DB:', error);
        });
        return `User with ID ${id} has been deleted`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sync_service_1.SyncService])
], UsersService);
//# sourceMappingURL=users.service.js.map