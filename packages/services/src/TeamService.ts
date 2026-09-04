import type { TeamMember } from '@rdplatforms/types';
import { activeDataSource } from './dataSource/activeDataSource';
import type { TeamDataSource } from './dataSource/types';

export class TeamService {
  constructor(private readonly dataSource: TeamDataSource) {}

  getByBusiness(businessId: string): Promise<TeamMember[]> {
    return this.dataSource.listTeamByBusiness(businessId);
  }
}

export const teamService = new TeamService(activeDataSource);
