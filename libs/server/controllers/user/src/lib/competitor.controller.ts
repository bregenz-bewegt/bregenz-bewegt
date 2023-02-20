import {
  GetCurrentUser,
  HasRole,
  MapProfilePictureInterceptor,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User } from '@prisma/client';
import {
  CompetitorDetail,
  CompetitorFriendStatus,
} from '@bregenz-bewegt/shared/types';
import { ActivityChartData } from '@bregenz-bewegt/client/types';
import { ActivityService } from '@bregenz-bewegt/server/controllers/activity';
import { FriendService } from '@bregenz-bewegt/server/controllers/friend';

@Controller('competitors')
export class CompetitorController {
  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private friendService: FriendService
  ) {}

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(
    RemoveSensitiveFieldsInterceptor,
    new MapProfilePictureInterceptor()
  )
  @Get('profile/:username')
  async getCompetitorProfile(
    @Param('username')
    username: User['username']
  ): Promise<CompetitorDetail | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...result } = await this.userService.findByUsername(
      username
    );
    if (!result) return undefined;
    return result as CompetitorDetail;
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Get('chart/:username')
  async getCompetitorGraphData(
    @Param('username') username: User['username']
  ): Promise<ActivityChartData | undefined> {
    const competitor = await this.userService.findByUsername(username);
    if (!competitor) return undefined;
    return competitor
      ? this.activityService.getChartData(competitor.id, new Date().getMonth())
      : undefined;
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @Get('friends/:username')
  async getCompetitorFriendStatus(
    @GetCurrentUser('sub') userId: User['id'],
    @Param('username') username: User['username']
  ): Promise<CompetitorFriendStatus | undefined> {
    const competitor = await this.userService.findByUsername(username);
    const user = await this.userService.findById(userId);

    if (!competitor || !user) return undefined;

    const result: CompetitorFriendStatus = {
      chat: false,
      friends: false,
      recievedRequest: false,
      requestedRequest: false,
    };

    result.friends = (await this.friendService.getFriends({}, user.id)).some(
      (u) => u.id === competitor.id
    );

    if (result.friends) {
      result.chat = !(
        await this.friendService.getFriends(
          { onlyConversationsless: true },
          user.id
        )
      ).some((u) => u.id === competitor.id);
    } else {
      result.recievedRequest = (
        await this.friendService.getReceivedFriendRequests(user.id)
      ).some((u) => u.requesteeId === competitor.id);

      result.requestedRequest = (
        await this.friendService.getRequestedFriendRequests(user.id)
      ).some((u) => u.addresseeId === competitor.id);
    }

    return result;
  }
}
