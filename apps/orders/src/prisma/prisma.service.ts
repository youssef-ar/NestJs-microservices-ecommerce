import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    private _order: any;
    public get order(): any {
        return this._order;
    }
    public set order(value: any) {
        this._order = value;
    }
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get<string>('DATABASE_URL'),
                },
            },
        });
    }
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
