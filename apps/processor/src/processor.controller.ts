import { Controller, Get } from '@nestjs/common';
import { ProcessorService } from './processor.service';

@Controller()
export class ProcessorController {
  constructor(private readonly processorService: ProcessorService) {}

  @Get()
  processor() {
    this.processorService.run().catch(() => {
      console.error('Ocorreu um erro');
    });

    return { ok: true };
  }
}
