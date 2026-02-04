import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/users/entities/user.entity';
import { UserRole } from '@/users/enums/user-role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/roles/roles.guard';

@Controller('stations')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  @ApiOperation({ summary: 'Find all stations' })
  @ApiResponse({ status: 200, description: 'Returns an array of stations' })
  @Public()
  findAll() {
    return this.stationsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Find a station by slug' })
  @ApiResponse({ status: 200, description: 'Returns a station' })
  @Public()
  findOne(@Param('slug') slug: string) {
    return this.stationsService.findOneBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create  new station' })
  @ApiResponse({ status: 200, description: 'Returns a station' })
  @ApiBearerAuth()
  create(
    @CurrentUser() user: User,
    @Body() createStationDto: CreateStationDto,
  ) {
    return this.stationsService.create(createStationDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a station' })
  @ApiResponse({ status: 200, description: 'Returns an updated station' })
  @ApiBearerAuth()
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ) {
    return this.stationsService.update(+id, updateStationDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Returns an updated station' })
  @ApiBearerAuth()
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.stationsService.remove(+id);
  }
}
