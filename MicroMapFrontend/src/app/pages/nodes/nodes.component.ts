import { Component, OnInit, ViewChild } from '@angular/core';
import { Node } from 'app/node';
import { CallsService } from 'app/calls.service';
import { NodeService } from 'app/node.service';
import { error } from 'console';
import { FileService } from 'app/file.service';
import { KeycloakService } from 'keycloak-angular';
import { GraphComponent } from 'app/shared/graph/graph.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'nodes.component.html',
    styleUrls: ['./nodes.component.css'],
    animations: [
      trigger('fadeInAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('1000ms', style({ opacity: 1 }))
        ])
      ])
    ]
})

export class NodesComponent implements OnInit {
    deleteName: string;
    nodes: Node[] = [];
    showAlert = false;
    errorLoading=false;
    errorDelete=false;
    errorExport=false;
    isAdmin: boolean;



    constructor(private nodeService: NodeService,private fileService : FileService ,private keycloakService: KeycloakService) {
      
    }
    ngOnInit() {
      const userRoles: string[] = this.keycloakService.getUserRoles();
      this.isAdmin = userRoles.includes('admin');
      
        this.getAll();
      }
     
      public deleteModel(name: string): void {
        document.getElementById('deleteModal').style.display = 'block';
        this.deleteName = name;

      }
      
      public deleteAllModel(): void {
        document.getElementById('deleteAllModal').style.display = 'block';
        
      }
      
      deleteNode() {
        document.getElementById('deleteModal').style.display = 'none';
        this.nodeService.deleteNode(this.deleteName).subscribe({
          next: () => {
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
            }, 1000);
      
            this.nodeService.getAllNodes().subscribe({
              next: (res) => {
                this.nodes = res;
              },
              error: () => {
                this.errorLoading = true;
              }
            });
          },
          error: () => {
            this.errorDelete = true;
            setTimeout(() => {
              this.errorDelete = false;
            }, 1000);
          }
        });
        
      }
      
      deleteAll() {
        document.getElementById('deleteAllModal').style.display = 'none';
        this.nodeService.deleteAll().subscribe({
          next: () => {
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
            }, 1000);
      
            this.nodeService.getAllNodes().subscribe({
              next: (res) => {
                this.nodes = res;
              },
              error: () => {
                this.errorLoading = true;
              }
            });
          },
          error: () => {
            this.errorDelete = true;
            setTimeout(() => {
              this.errorDelete = false;
            }, 1000);
          }
        });
        
      }
      //download
      exportNodes() {
        this.fileService.exportNodes().subscribe({
          next: (response) => {
            this.saveFile(response);
          },
          error: () => {
            this.errorExport = true;
            setTimeout(() => {
              this.errorExport = false;
            }, 1000);
          }
        });
      }
      
      private saveFile(data: Blob) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const saveas = require('file-saver');
        saveas.saveAs(blob, 'nodes.xlsx');
      }



       //TABLE *********************************************************************************************************************************
    searchText: string = '';
    sortBy: string = '';
  sortOrder: number = 1;
  nodestemp: Node[] = [];

  
  n:number;//for two buttons
  getAll() {
    this.nodeService.getAllNodes().subscribe({
      next: (data: Node[]) => {
        this.n=data.length;
        this.nodestemp = data;
        this.nodes = data; // Initialize calls with original data
        this.updatepaginatedNodes();
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
    this.nodes = this.sortNodes([...this.nodes], this.sortBy, this.sortOrder); // Sort the current nodes array
    this.updatepaginatedNodes();
  }
  
  private sortNodes(items: Node[], field: string, order: number): Node[] {
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
      this.nodes = [...this.nodestemp];
      
    } else {
      // Filter calls based on search text
      const searchTextLower = this.searchText.toLowerCase();
      this.nodes = this.nodestemp.filter((call) =>
        Object.values(call).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTextLower)
        )
      );
    }
    this.updatepaginatedNodes();
  }



//pagination
pageSizeOptions = [5, 10, 25, 50];
  selectedPageSize: number = 10; // Default selected option

  @ViewChild(MatPaginator) paginator: MatPaginator;
  paginatedNodes: Node[] = [];
  pageIndex: number = 0;
  enableText: boolean;
  


  
  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPageSize = Number(selectElement.value);
    this.updatepaginatedNodes();
  }

  updatepaginatedNodes(): void {
    this.onPageChange({
      pageIndex: this.paginator ? this.paginator.pageIndex : 0,
      pageSize: this.selectedPageSize,
      length: this.nodes.length
    });
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginatedNodes = this.nodes.slice(startIndex, endIndex);
    this.enableText = this.paginator && this.paginator.pageIndex === 0;
  }


}
