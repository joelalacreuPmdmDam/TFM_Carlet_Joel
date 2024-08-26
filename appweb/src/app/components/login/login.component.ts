import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from "primeng/password";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CheckboxModule,StyleClassModule,InputTextModule,ButtonModule,PasswordModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder,private _authService: AuthService, private router: Router){
    this.formGroup = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }
  
  login(): void {
    if (this.formGroup.valid) {
      this._authService.login(this.formGroup.value.email, this.formGroup.value.password).subscribe(
        (response) => {
          if (response.token) {
            this._authService.setToken(response.token);
            this._authService.email = this.formGroup.value.email;
            this._authService.setName(response.nombreUsuario);
            this.router.navigate(['/inicio']);
          } else {
            alert('Inicio de sesión fallido');
          }
        },
        (error) => {
          console.error('Error:', error);
          alert('Ha ocurrido un error al intentar iniciar sesión');
        }
      );
    }
  }

}
