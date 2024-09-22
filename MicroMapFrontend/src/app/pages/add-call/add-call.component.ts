
import { Call } from 'app/call';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CallsService } from 'app/calls.service';
import { NodeService } from 'app/node.service';
import { error } from 'console';
import { FileService } from 'app/file.service';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'add-call.component.html'
})

export class AddCallComponent implements OnInit {
    options: string[];
    type: string = "sync";
    showAlert = false;
    errorAddCall = false;
    selectedFileName = "No file is selected";
    file: File;
    isFileSelected = false;
    errorImportCalls = false;
    importCallsErrorMessage = "";
    importedSuccess = false;
    constructor(private callService: CallsService, private nodeService: NodeService, private fileService: FileService) {

    }
    ngOnInit() {
        this.nodeService.getAllNodesNames().subscribe((res) => {
            this.options = res;
        });
    }

    addCall(form: NgForm): void {
        const formData = new FormData();
        formData.append("startNode", form.value.startNode);
        formData.append("endNode", form.value.endNode);
        formData.append("type", form.value.type);
        if (this.type == 'sync') {
            formData.append("api", form.value.api);
        }
        else if (this.type == 'async') {
            formData.append("topic", form.value.topic);
            formData.append("eventProduced", form.value.eventProduced);

        }
        formData.append("description", form.value.description);
        this.callService.addCall(formData).subscribe({
            next: ((res: Call) => {
                if (res != null) {
                    this.showAlert = true;
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 1000);
                    form.reset();
                    this.type = 'sync'
                }
                else {
                    form.reset();
                    this.type = 'sync'
                    this.errorAddCall = true;
                    setTimeout(() => {
                        this.errorAddCall = false;
                    }, 2000);
                }
            })
            , error: ((error) => {
                this.errorAddCall = true;
                setTimeout(() => {
                    this.errorAddCall = false;
                }, 2000);
            }
            )
        }
        )
    }

handleFileSelect(e){
    const auxFile: File = e.target?.files[0];
    if (!auxFile) return;
    this.file = e.target.files[0];
    this.selectedFileName = e.target.files[0].name;
    this.isFileSelected = true;
}

importNodes(form: NgForm){
    if (!this.file) {
        this.errorImportCalls = true;
        this.importCallsErrorMessage = "A file must be selected";
        setTimeout(() => {
            this.errorImportCalls = false;
            this.importCallsErrorMessage = "";
        }, 2000)
        return;
    }
    const formData = new FormData();
    formData.append("file", this.file);

    this.fileService.importCalls(formData).subscribe({
        next: ((response) => {
            this.importedSuccess = true;
            setTimeout(() => this.importedSuccess = false, 2000)
        }),
        error: (({ error }) => {

            this.errorImportCalls = true;
            this.importCallsErrorMessage = error.message || 'An unexpected error occurred';

            console.log(error);
            setTimeout(() => {
                this.errorImportCalls = false;
                this.importCallsErrorMessage = "";
            }, 3000)


        })
    })
}
}
