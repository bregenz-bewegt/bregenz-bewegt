import { Public } from '@bregenz-bewegt/server/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  getData() {
    return this.appService.getData();
  }
}
