import { Component, OnInit, Inject } from '@angular/core';

import { DataService } from '../../data.service';
import { DataWithCount } from '../../models/data-with-count';
import { Team } from '../../models/team';
import { ApplicationConfig } from '../../models/app-config';
import { GafAuth0Service } from '@gaf/angular-authentication-auth0';

enum TeamListModes {
  View = 0,
  Add = 1,
  Edit = 2
}

@Component({
  selector: 'gaf-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {
  teamData: DataWithCount<Team>;
  mode: TeamListModes = TeamListModes.View;
  team: Team = {};

  constructor(
    public authService: GafAuth0Service,
    private data: DataService,
    @Inject('ApplicationConfig') private config: ApplicationConfig
  ) {
    this.authService.onAuthenticationChanged.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.refreshData();
      }
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.refreshData();
    }
  }

  refreshData() {
    this.queryTeams();
  }

  queryTeams() {
    this.data.getTeams().subscribe(data => {
      this.teamData = data;
    });
  }

  addTeam() {
    this.team = {};
    this.mode = TeamListModes.Add;
  }

  editTeam(team: Team) {
    this.team = {...team};
    this.mode = TeamListModes.Edit;
  }

  showEditButton(): boolean {
    return this.mode === TeamListModes.View;
  }

  addEditDone(saved: boolean) {
    this.mode = TeamListModes.View;
    if (saved) {
      this.refreshData();
    }
  }
}
