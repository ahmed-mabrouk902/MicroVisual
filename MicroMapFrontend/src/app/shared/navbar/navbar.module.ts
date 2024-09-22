import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { databaseSwitch } from './databaseSwitch.service';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule, FormsModule ],
    // providers: [databaseSwitch],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ],
    
})

export class NavbarModule {}
