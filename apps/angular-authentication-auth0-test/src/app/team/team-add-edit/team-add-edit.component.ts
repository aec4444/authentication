import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Team } from '../../models/team';
import { DataService } from '../../data.service';
import { GafAuth0Service } from '@gaf/angular-authentication-auth0';

@Component({
  selector: 'gaf-team-add-edit',
  templateUrl: './team-add-edit.component.html',
  styleUrls: ['./team-add-edit.component.scss']
})
export class TeamAddEditComponent implements OnInit {
  @Input() team: Team = {};
  @Output() saved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public authService: GafAuth0Service,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  save() {
    this.dataService.saveTeam(this.team).subscribe(data => {
      this.saved.emit(true);
    });
  }

  cancel() {
    this.canceled.emit();
  }
}
