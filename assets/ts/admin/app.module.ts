import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';

// Componentes
import { AppComponent }   from './app.component';
import { login } from './components/login/login.component';

@NgModule({
    declarations: [AppComponent],
    imports:      [BrowserModule],
    bootstrap:    [AppComponent],
})

export class AppModule {}
