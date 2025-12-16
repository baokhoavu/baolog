import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({ orderBy: { publishedAt: 'desc' } });
  }

  async findBySlug(slug: string) {
    return this.prisma.post.findUnique({ where: { slug } });
  }

  async create(data: any) {
    return this.prisma.post.create({ data });
  }
}
