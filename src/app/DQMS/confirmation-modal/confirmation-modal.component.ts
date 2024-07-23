import { Component, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('modal') modal: any;

  @Input() showFooter: boolean = true; // Control footer visibility
  @Input() showIcon:boolean= false;
  @Input() isSuccessModal: boolean = false; 
  open() {
    this.modal.nativeElement.classList.add('show'); // Show modal
    this.modal.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  close() {
    this.modal.nativeElement.classList.remove('show'); // Hide modal
    this.modal.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
  onConfirm() {
    this.confirm.emit();
    
      //this.showSuccessAnimation(); 
    
    this.close();
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }
showSuccessAnimation() {
    console.log('called')
    // Add animate class to tick-icon
    const tickIcon = this.modal.nativeElement.querySelector('.tick-icon');
    if (tickIcon) {
      tickIcon.classList.add('animate');

      // Remove animate class after animation duration
      setTimeout(() => {
        tickIcon.classList.remove('animate');
      }, 300); // Adjust according to your CSS animation duration
    }
  }
}

