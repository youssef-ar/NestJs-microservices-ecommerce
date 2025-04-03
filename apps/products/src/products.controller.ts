import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Get('products')
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.getProductById(productId);
  }
  
  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() dto) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.updateProduct(productId, dto);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.deleteProduct(productId);
  }

  @Get('products')
  async getFilteredProducts(
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('search') search?: string
  ) {

    const filters = {
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      rating: rating ? parseInt(rating, 10) : undefined,
      search: search ?? undefined,
    };

    if (filters.categoryId && isNaN(filters.categoryId)) throw new Error('Invalid category ID');
    if (filters.minPrice && isNaN(filters.minPrice)) throw new Error('Invalid min price');
    if (filters.maxPrice && isNaN(filters.maxPrice)) throw new Error('Invalid max price');
    if (filters.rating && isNaN(filters.rating)) throw new Error('Invalid rating');

    return this.productsService.getFilteredProducts(filters);

  }

  @Post('/categories')
  async createCategory(@Body('name') name: string) {
    return this.productsService.createCategory(name);
  }

  @Get('/categories')
  async getAllCategories() {
    return this.productsService.getAllCategories();
  }

  @Post('/categories/:categoryId/products/:productId')
  async addProductToCategory(
    @Param('productId') productId: string,
    @Param('categoryId') categoryId: string
  ) {
    const parsedProductId = parseInt(productId, 10);
    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedProductId)) throw new Error('Invalid product ID');
    if (isNaN(parsedCategoryId)) throw new Error('Invalid category ID');
    return this.productsService.addProductToCategory(parsedProductId, parsedCategoryId);
  }

  @Delete('/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) throw new Error('Invalid category ID'); 
    return this.productsService.deleteCategory(categoryId);
}
}
