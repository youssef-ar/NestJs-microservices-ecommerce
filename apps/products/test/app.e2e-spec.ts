import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { ProductsModule } from '../src/products.module';
import { CreateProductDto, EditProductDto } from '../src/dto/index';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Products e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [ProductsModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3002);

    prisma = app.get(PrismaService);
    //await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3002',
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Products', () => {
    const dto: CreateProductDto = {
      name: 'Test',
      description: 'Test',
      price: 10,
      brand: 'Test',
      image: 'Test'
    };

    describe('Create', () => {
      it('should throw if name empty', () => {
        return pactum
          .spec()
          .post('/products')
          .withBody({
            description: dto.description,
            price: dto.price,
            brand: dto.brand,
          })
          .expectStatus(400);
      });
      it('should throw if description empty', () => {
        return pactum
          .spec()
          .post('/products')
          .withBody({
            name: dto.name,
            price: dto.price,
            brand: dto.brand,
          })
          .expectStatus(400);
      });
      it('should throw if price empty', () => {
        return pactum
          .spec()
          .post('/products')
          .withBody({
            name: dto.name,
            description: dto.description,
            brand: dto.brand,
          })
          .expectStatus(400);
      });
      it('should throw if brand empty', () => {
        return pactum
          .spec()
          .post('/products')
          .withBody({
            name: dto.name,
            description: dto.description,
            price: dto.price,
          })
          .expectStatus(400);
      });
      it('should create product', () => {
        return pactum
          .spec()
          .post('/products')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    
    describe('Edit', () => {
      let productId: number;
      beforeAll(async () => {
        const product = await prisma.product.findFirst({ where: { name: dto.name } });
        productId = product.id;
      });

      const editDto: EditProductDto = {
        name: 'Test2',
        description: 'Test2',
        price: 20,
        brand: 'Test2',
      };

      it('should edit product', () => {
        return pactum
          .spec()
          .patch(`/products/${productId}`)
          .withBody(editDto)
          .expectStatus(200);
      });
    });

    describe('Get', () => {
      let productId: number;
      beforeAll(async () => {
        const product = await prisma.product.create({
          data: dto,
        });
        productId = product.id;
      });

      it('should get product', () => {
        return pactum
          .spec()
          .get(`/products/${productId}`)
          .expectStatus(200);
      });
    });

    describe('Get All', () => {
      it('should get all products', () => {
        return pactum
          .spec()
          .get('/products')
          .expectStatus(200);
      });
    });

    describe('Get Filtered', () => {
      it('should get filtered products', () => {
        return pactum
          .spec()
          .get('/products?minPrice=10&maxPrice=20')
          .expectStatus(200);
      });
    });

    describe('Create Category', () => {
      it('should create category', () => {
        return pactum
          .spec()
          .post('/categories')
          .withBody({
            name: 'Test',
          })
          .expectStatus(201);
      });
    });

    describe('Get All Categories', () => {
      it('should get all categories', () => {
        return pactum
          .spec()
          .get('/categories')
          .expectStatus(200);
      });
    });

    describe('Add Product To Category', () => {
      let productId: number;
      let categoryId: number;
      beforeAll(async () => {
        const product = await prisma.product.findFirst({ where: { name: dto.name } });
        productId = product.id;
        const category = await prisma.category.findFirst({ where: { name: 'Test' } });
        if (category) {
          categoryId = category.id;
        } else {
          throw new Error('Category not found');
        }
      });

      it('should add product to category', () => {
        return pactum
          .spec()
          .post(`/categories/${categoryId}/products/${productId}`)
          .expectStatus(201);
      });
    });

    describe('Delete', () => {
      let productId: number;
      beforeAll(async () => {
        const product = await prisma.product.findFirst({ where: { name: dto.name } });
        productId = product.id;
      });

      it('should delete product', () => {
        return pactum
          .spec()
          .delete(`/products/${productId}`)
          .expectStatus(200);
      });
    });


    describe('Delete Category', () => {
      let categoryId: number;
      beforeAll(async () => {
        const category = await prisma.category.findFirst({ where: { name: 'Test' } });
        if (category) {
          categoryId = category.id;
        } else {
          throw new Error('Category not found');
        }
      });

      it('should delete category', () => {
        return pactum
          .spec()
          .delete(`/categories/${categoryId}`)
          .expectStatus(200);
      });
    });
    

    
      
});});

  