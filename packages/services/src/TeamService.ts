import type { TeamMember } from '@rdplatforms/types';
import { jsonDataSource } from './dataSource/JsonDataSource';
import type { TeamDataSource } from './dataSource/types';

export class TeamService {
  constructor(private readonly dataSource: TeamDataSource) {}

  getByBusiness(businessId: string): Promise<TeamMember[]> {
    return this.dataSource.listTeamByBusiness(businessId);
  }
}

export const teamService = new TeamService(jsonDataSource);
