import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.getProductById(productId);
  }
  
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch('/:id')
  async updateProduct(@Param('id') id: string, @Body() dto) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.updateProduct(productId, dto);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.deleteProduct(productId);
  }

  @Get('/category/:id')
  async getProductsByCategory(@Param('id') id: string) {
    const productId = parseInt(id, 10); 
    if (isNaN(productId)) {
      throw new Error('Invalid product ID'); 
    }
    return this.productsService.getProductsByCategory(productId);
  }

  @Get('/search/:query')
  async searchProducts(@Param('query') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('/price-range/:min/:max') 
  async getProductsByPriceRange(@Param('min') min: string, @Param('max') max: string) {
    const minPrice = parseInt(min, 10); 
    if (isNaN(minPrice)) {
      throw new Error('Invalid min Price'); 
    }
    const maxPrice = parseInt(max, 10); 
    if (isNaN(maxPrice)) {
      throw new Error('Invalid max Price'); 
    }
    return this.productsService.getProductsByPriceRange(minPrice, maxPrice);
  }

  @Get('/rating/:rating')
  async getProductsByRating(@Param('rating') rating: string) {
    const productRating = parseInt(rating, 10); 
    if (isNaN(productRating)) {
      throw new Error('Invalid product Rating'); 
    }
    return this.productsService.getProductsByRating(productRating);
  }
}
