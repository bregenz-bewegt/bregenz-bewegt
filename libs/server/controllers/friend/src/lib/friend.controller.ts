import {
  HasRole,
  RoleGuard,
  GetCurrentUser,
  RemoveSensitiveFieldsInterceptor,
} from '@bregenz-bewegt/server/common';
import {
  SearchUserQueryDto,
  FriendSearchResult,
  CreateFriendRequestDto,
  AllFriendRequests,
  FriendAdresseeResult,
  FriendRequesteeResult,
  RevokeFriendRequestDto,
  RejectFriendRequestDto,
  AcceptFriendRequestDto,
  RemoveFriendDto,
} from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Role, User, FriendRequest } from '@prisma/client';
import { FriendService } from './friend.service';

@Controller('friends')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Get()
  getFriends(@GetCurrentUser('sub') userId: User['id']): Promise<User[]> {
    return this.friendService.getFriends(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('search')
  searchUser(
    @GetCurrentUser('sub') userId: User['id'],
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    dto: SearchUserQueryDto
  ): Promise<FriendSearchResult[]> {
    return this.friendService.searchUserByUsername(dto.username, userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Delete('remove')
  removeFriend(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: RemoveFriendDto
  ): Promise<User> {
    return this.friendService.removeFriend(userId, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Post('request')
  createFriendRequest(
    @GetCurrentUser('sub') requesteeId: User['id'],
    @Body() dto: CreateFriendRequestDto
  ): Promise<FriendRequest> {
    return this.friendService.createFriendRequest({
      requesteeId,
      addresseeId: dto.addresseeId,
    });
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('requests')
  async getFriendRequests(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<AllFriendRequests> {
    const requested = await this.friendService.getRequestedFriendRequests(
      userId
    );
    const received = await this.friendService.getReceivedFriendRequests(userId);

    return { requested, received };
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('requests/requested')
  getRequestedFriendRequests(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<(FriendRequest & { addressee: FriendAdresseeResult })[]> {
    return this.friendService.getRequestedFriendRequests(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Get('requests/received')
  getReceivedFriendRequests(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<(FriendRequest & { requestee: FriendRequesteeResult })[]> {
    return this.friendService.getReceivedFriendRequests(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Post('requests/accept')
  acceptFriendRequest(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: AcceptFriendRequestDto
  ): Promise<FriendRequest> {
    return this.friendService.acceptFriendRequest(userId, dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Post('requests/reject')
  rejectFriendRequest(
    @Body() dto: RejectFriendRequestDto
  ): Promise<FriendRequest> {
    return this.friendService.deleteFriendRequest(dto.requestId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(RemoveSensitiveFieldsInterceptor)
  @Post('requests/revoke')
  revokeFriendRequest(
    @Body() dto: RevokeFriendRequestDto
  ): Promise<FriendRequest> {
    return this.friendService.deleteFriendRequest(dto.requestId);
  }
}