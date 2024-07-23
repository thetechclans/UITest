import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges{
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  pageNumbers: (number | string)[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages'] || changes['currentPage']) {
      this.updatePageNumbers();
    }
  }
  /*updatePageNumbers(): void {
    const pageNumbers = [];
    const maxPagesToShow = 10;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const halfRange = Math.floor(maxPagesToShow / 2);
      let start = Math.max(1, this.currentPage - halfRange);
      let end = Math.min(this.totalPages, this.currentPage + halfRange);

      if (this.currentPage <= halfRange) {
        start = 1;
        end = maxPagesToShow;
      } else if (this.currentPage + halfRange >= this.totalPages) {
        start = this.totalPages - maxPagesToShow + 1;
        end = this.totalPages;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (start > 1) {
        pageNumbers.unshift('...');
      }

      if (end < this.totalPages) {
        pageNumbers.push('...');
      }
    }

    this.pageNumbers = pageNumbers;
  }*/
  updatePageNumbers(): void {
    const maxPagesToShow = 10;
    const pageNumbers = [];

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (this.currentPage <= Math.ceil(maxPagesToShow / 2)) {
        // Display first 10 pages
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - Math.floor(maxPagesToShow / 2)) {
        // Display last 10 pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = this.totalPages - maxPagesToShow + 2; i <= this.totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Display pages around the current page
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = this.currentPage - Math.floor(maxPagesToShow / 2); i <= this.currentPage + Math.floor(maxPagesToShow / 2); i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(this.totalPages);
      }
    }

    this.pageNumbers = pageNumbers;
  }

  

  loadPage(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChange.emit(page);
    } else if (page === 'previous' && this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  

}
