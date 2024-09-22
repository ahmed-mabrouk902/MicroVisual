import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileService } from 'app/file.service';
import { NodeService } from 'app/node.service';
import { error } from 'console';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'add-node.component.html',
    styleUrls: ['./add-node.component.css']
})

export class AddNodeComponent implements OnInit {
    name: string;
    type: string;
    showAlert = false;
    errorAddNode = false;
    selectedFileName = "No file is selected";
    file: File;
    isFileSelected = false;
    errorImportNodes = false;
    importNodesErrorMessage = "";
    importedSuccess = false;
    constructor(private nodeService: NodeService,private fileService:FileService) {

    }
    ngOnInit() {
    }
    
    addNode(form: NgForm): void {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("type", this.type);
        this.nodeService.addNode(formData).subscribe({ next:((res) => {
            if (res != null) {
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                }, 1000);
                form.reset();
            }
            else {
                this.errorAddNode = true;
                setTimeout(() => {
                    this.errorAddNode = false;
                }, 2000);
                form.reset();
            }
        }),
        error:((error)=>{
            this.errorAddNode = true;
                setTimeout(() => {
                    this.errorAddNode = false;
                }, 2000);
        })
    })
    

    }

    handleFileSelect(e){
        const auxFile: File = e.target?.files[0];
        if(!auxFile) return;
        
        this.file = e.target.files[0];
        this.selectedFileName = e.target.files[0].name;
        this.isFileSelected = true;
    }

    importNodes(form: NgForm){
        if(!this.file){
            this.errorImportNodes = true;
            this.importNodesErrorMessage = "A file must be selected";
            setTimeout(() => {
                this.errorImportNodes = false;
                this.importNodesErrorMessage = "";
            }, 2000)
            return;
        }
        const formData = new FormData();
        formData.append("file", this.file);
        
        this.fileService.importNodes(formData).subscribe({
            next: ((response) =>{
                this.importedSuccess = true;
                setTimeout(() => this.importedSuccess = false, 2000)
            }) ,
            error: (({error}) => {

                this.errorImportNodes = true;
                this.importNodesErrorMessage = error.message || 'An unexpected error occurred';
                console.log(error);
                
               
                setTimeout(() => {
                    this.errorImportNodes = false;
                    this.importNodesErrorMessage = "";
                }, 2000)
            })
        })
    }
   
}