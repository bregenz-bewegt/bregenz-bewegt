import { Module } from '@nestjs/common';
import { NotificationGateway } from './gateways';

@Module({
  controllers: [],
  providers: [NotificationGateway],
  exports: [],
})
export class GatewayModule {}
