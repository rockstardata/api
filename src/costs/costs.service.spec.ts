import { Test, TestingModule } from '@nestjs/testing';
import { CostsService } from './costs.service';

describe('CostsService', () => {
  let service: CostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostsService],
    }).compile();

    service = module.get<CostsService>(CostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
