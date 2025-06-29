import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    getPosts(): Promise<{
        id: number;
        title: string;
        content: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
