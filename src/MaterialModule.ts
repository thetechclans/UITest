import { NgModule } from "@angular/core";
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconAnchor} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select'
import {MatMenuModule} from '@angular/material/menu';





@NgModule({
    exports:[
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatToolbarModule,
        MatToolbarModule,
        MatSelectModule,
        MatRadioModule,
        MatMenuModule,
        MatDialogModule
        
      

        ]
})

export class MaterialModule{

}

