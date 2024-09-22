import { Call } from 'app/call';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CallsService } from 'app/calls.service';
import { error } from 'console';
import { FileService } from 'app/file.service';
import { KeycloakService } from 'keycloak-angular';
import { Node } from 'app/node';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
    selector: 'calls',
    moduleId: module.id,
    templateUrl: 'calls.component.html',
    styleUrls: ['./calls.component.css'],
    
})

export class CallsComponent implements OnInit {
    calls: Call[] = [];
    deleteId: string = "";
    type: string = "sync";
    id: number;
    api: string;
    topic: string;
    eventProduced: string;
    description: string;
    showAlert = false;
    errorUpdateCall = false;
    showDeleteAlert = false;
    errorLoading =false;
    errorDelete = false;
    errorExport=false;
    isAdmin: boolean;

constructor(private callsService: CallsService,private fileService: FileService ,private keycloakService: KeycloakService) { }
   
                      ngOnInit() {
                        const userRoles: string[] = this.keycloakService.getUserRoles();
                        this.isAdmin = userRoles.includes('admin');
                        

                         this.getAll();

                      }
  
              //update extraction
              public updateModel(id: number, type: string, api: string, topic: string, eventProduced: string, description: string): void {
                    document.getElementById('updateModel').style.display = 'block';
                    this.id = id;
                    this.type = type;
                    this.api = api;
                    this.topic = topic;
                    this.eventProduced = eventProduced;
                    this.description = description;
                }

              updateCall(): void {
                    const formData = new FormData();
                    formData.append("type", this.type);
                    if (this.type == 'sync') {
                      formData.append("api", this.api);
                    } else if (this.type == 'async') {
                      formData.append("topic", this.topic);
                      formData.append("eventProduced", this.eventProduced);
                    }
                    formData.append("description", this.description);
                  
                    this.callsService.updateCall(this.id, formData).subscribe({
                      next: (res) => {
                        document.getElementById('updateModel').style.display = 'none';
                        if (res != null) {
                          this.showAlert = true;
                          setTimeout(() => {
                            this.showAlert = false;
                          }, 1000);
                        } else {
                          this.errorUpdateCall = true;
                          setTimeout(() => {
                            this.errorUpdateCall = false;
                          }, 2000);
                        }
                  
                        this.callsService.getAllCalls().subscribe({
                          next: (response: Call[]) => {
                            this.calls = response;
                          },
                          error: (error) => {
                            this.errorLoading = true;
                          }
                        });
                      },
                      error: (error) => {
                        this.errorUpdateCall = true;
                        setTimeout(() => {
                          this.errorUpdateCall = false;
                        }, 2000);
                      }
                    });
                  }
      
    
    
    //to select when clicking
    public deleteModal(id: string): void {
      document.getElementById('id01').style.display = 'block';
      this.deleteId = id;
  }
  //while clicking delete
    public deleteCall(): void {
        document.getElementById('id01').style.display = 'none';
        this.callsService.deleteCall(this.deleteId).subscribe({
          next: () => {
            this.showDeleteAlert = true;
            setTimeout(() => {
              this.showDeleteAlert = false;
            }, 1000);
      
            
          },
          error: () => {
            this.errorDelete = true;
          }
        });
      }
//all
      public deleteAllModal(): void {
        document.getElementById('deleteAllModal').style.display = 'block';
        
    }
      public deleteAll(): void {
        document.getElementById('deleteAllModal').style.display = 'none';
        this.callsService.deleteAll().subscribe({
          next: () => {
            this.showDeleteAlert = true;
            setTimeout(() => {
              this.showDeleteAlert = false;
            }, 1000);
      
           
          },
          error: () => {
            this.errorDelete = true;
            setTimeout(() => {
              this.errorDelete = false;
            }, 1000);
          }
        });
      }

      //exporting Calls
    exportCalls() {
        this.fileService.exportCalls().subscribe(
            {
                next: ((response) => {
                    this.saveFile(response);
                  }),
                error: (({})=>{
                    this.errorExport = true;
                    setTimeout(() => {
                        this.errorExport = false;
                    }, 1000);
                })
                

            }
        )
        
        
      }
    
      private saveFile(data: Blob) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const saveas = require('file-saver');
        saveas.saveAs(blob, 'calls.xlsx');
      }



      
    //for table 
    searchText: string = '';
    sortBy: string = '';
  sortOrder: number = 1;
  callstemp: Call[] = [];

  n:number;
  getAll() {
    this.callsService.getAllCalls().subscribe({
      next: (data: Call[]) => {
        this.n=data.length;
        this.callstemp = data;
        this.calls = [...this.callstemp]; // Initialize calls with original data
        
        this.updatePaginatedCalls();
      },
      error: (error) => {
        this.errorLoading = true;
      },
    });
  }
  
  sortItems(field: string): void {
    if (field === this.sortBy) {
      this.sortOrder *= -1; // Reverse sort order if same field is clicked again
    } else {
      this.sortBy = field; // Set new sort field
      this.sortOrder = 1; // Default ascending order
    }
    
    this.calls = this.sortNodes([...this.calls], this.sortBy, this.sortOrder); // Sort the current nodes array
    this.updatePaginatedCalls();
  }
  
  private sortNodes(items: Call[], field: string, order: number): Call[] {
    if (!items || !field) {
      return items;
    }
  
    return items.sort((a, b) => {
      const valueA = this.getPropertyValue(a, field);
      const valueB = this.getPropertyValue(b, field);
  
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * order;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * order;
      } else {
        // Fallback to basic comparison if types are different or undefined
        return (String(valueA).localeCompare(String(valueB))) * order;
      }
    });
    
  }
  
  private getPropertyValue(item: any, field: string): any {
    // Handle nested properties like 'parent.child.field'
    if (field.includes('.')) {
      const fields = field.split('.');
      let value = item;
      for (const f of fields) {
        value = value[f];
      }
      return value;
    } else {
      return item[field];
    }
  }
  
  filterItems(): void {
    if (!this.searchText.trim()) {
      // If search text is empty, show all calls
      
      this.calls = [...this.callstemp];
      
    } else {
      // Filter calls based on search text
      const searchTextLower = this.searchText.toLowerCase();
      this.calls = this.callstemp.filter((call) =>
        Object.values(call).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTextLower)
        )
      );
      
    }
    this.updatePaginatedCalls();
  }
//pagination
pageSizeOptions = [5, 10, 25, 50];
  selectedPageSize: number = 10; // Default selected option

  @ViewChild(MatPaginator) paginator: MatPaginator;
  paginatedCalls: Call[] = [];
  pageIndex: number = 0;
  enableText: boolean;
  


  
  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPageSize = Number(selectElement.value);
    this.updatePaginatedCalls();
  }

  updatePaginatedCalls(): void {
    this.onPageChange({
      pageIndex: this.paginator ? this.paginator.pageIndex : 0,
      pageSize: this.selectedPageSize,
      length: this.calls.length
    });
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedCalls = this.calls.slice(startIndex, endIndex);
    this.enableText = this.paginator && this.paginator.pageIndex === 0;
  }
}
