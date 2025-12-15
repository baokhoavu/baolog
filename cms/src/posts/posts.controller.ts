import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAll() {
    const posts = await this.postsService.findAll();
    return { edges: posts.map((p) => ({ node: p })) };
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const post = await this.postsService.findBySlug(slug);
    return { post };
  }

  @Post()
  async create(@Body() body: any) {
    const created = await this.postsService.create(body);
    return created;
  }
}
