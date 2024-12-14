import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-contact",
  template: `<p-card header="Contact" class="block m-2 text-left">
  <div class="m-0">
    <!-- form -->
    <form #form="ngForm" (ngSubmit)="onSubmit(form)" class="p-fluid p-formgrid p-grid {{ isVisible ? '' : 'hidden' }}">
      <div class="p-field p-col-12">
        <label for="email" class="p-col-12 p-md-2">Email</label>
        <div class="p-col-12 p-md-10">
          <input id="email" [placeholder]="formData.email" name="email" ngModel type="email" pInputText class="p-inputtext p-component" required email />
        </div>
      </div>
      <div class="p-field p-col-12">
        <label for="message" class="p-col-12 p-md-2">Message</label>
        <div class="p-col-12 p-md-10">
          <textarea id="message" [placeholder]="formData.text" name="message" ngModel rows="5" pInputTextarea class="p-inputtextarea p-component" required maxlength="300"></textarea>
        </div>
      </div>
      <div class="p-field p-col-12 p-md-10 p-offset-md-2">
        <button type="submit" pButton label="Envoyer" class="p-button p-component" [disabled]="form.invalid"></button>
      </div>
    </form>
    <div class="p-fluid p-formgrid p-grid {{ isSuccess ? '' : 'hidden' }}">Demande de contact envoyée avec succès</div>
  </div>
</p-card>`,
  styleUrls: ["./contact.component.scss"],
  standalone: true,
  imports: [CardModule, FormsModule, ButtonModule],
})
export class ContactComponent {

  isVisible: boolean = true;
  isSuccess: boolean = false;

  public formData = {
    email: "email@mail.com",
    text: "lorem ipsum ...",
  }

  public onSubmit(form: NgForm): void {
    if (!form.valid) return;
    // hide form
    this.isVisible = false;
    // handle data

    // show success message
    this.isSuccess = true;

  }
}
