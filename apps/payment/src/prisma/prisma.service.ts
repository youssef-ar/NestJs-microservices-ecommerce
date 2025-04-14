import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    private _payment: any;
    public get payment(): any {
        return this._payment;
    }
    public set payment(value: any) {
        this._payment = value;
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
