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

  // search products
  async searchProducts(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    if(!products){
      throw new NotFoundException('No products found');
    }
    return products;
  }

  // get products by category
  async getProductsByCategory(categoryId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
      },
    });
    if(!products){
      throw new NotFoundException('No products found');
    }
    return products;
  }

  // get products by price range
  async getProductsByPriceRange(min: number, max: number) {
    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          {
            price: {
              gte: min,
            },
          },
          {
            price: {
              lte: max,
            },
          },
        ],
      },
    });
    if(!products){
      throw new NotFoundException('No products found');
    }
    return products;
  }
  // get products by rating
  async getProductsByRating(rating: number) {
    const products = await this.prisma.product.findMany({
      where: {
        rating,
      },
    });
    if(!products){
      throw new NotFoundException('No products found');
    }
    return products;
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
  
}
