import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto , EditProductDto } from './dto';


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private config: ConfigService){}

  // create product
  async createProduct(dto: CreateProductDto) {
    const product =  await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        image: dto.image,
        brand: dto.brand,
      }});

      return product;

  }

  // get all products

  async getAllProducts() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  // get product by id

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    return product;
  }

  // update product by id
  async updateProduct(id: number, dto: EditProductDto) {
    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ... dto
      },
    });
    if(!product) {
      throw new NotFoundException('Product not found');
    }
    return product
  }

  // delete product by id

  async deleteProduct(id: number) {
    const product = await this.prisma.product.delete({
      where: {
        id,
      },
    });
    if(!product) {
      throw new NotFoundException('Product not found');
    }
    return product
  }


  //create category
  async createCategory(name: string) {
    const category = await this.prisma.category.create({
      data: {
        name,
      },
    });
    return category;
  }
  // get all categories
  async getAllCategories() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }
  // add product to category
  async addProductToCategory(productId: number, categoryId: number) {
    const product = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        categoryId,
      },
    });
    return product;
  }


  // filter products
  async getFilteredProducts(filters: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    search?: string;
  }) {
    const query: any = {};
  
    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }
  
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.lte = filters.maxPrice;
    }
  
    if (filters.rating) {
      query.rating = filters.rating;
    }
  
    if (filters.search) {
      query.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }
  
    return this.prisma.product.findMany({ where: query });
  }

  // delete category
  async deleteCategory(id: number) {
    const category = await this.prisma.category.delete({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  
}
