# Slide Remote
This project is about the Slides or Presentations builded with HTML and CSS. In the content exist components that transmit events in real time.

<br/>

### Config Project 

#### Requirements 
> 1. Install NodeJS 
> 2. Install NPM  
> 3. Install BowerJS
> 4. Install MongoDB

#### Install SailsJS
> Install Sails globally in the machine  <br/>
`$ npm install sails -g `

#### Create database with Mongo DB
> execute Mongo Shell <br/>
`$ mongo` <br/>

> Create Database <br/>
`$ use slide_remote` <br/>


#### Run Project

> This commmand install NPM and Bower dependecies an later run sails project <br/>
`$ npm start`

<br/>


### Using Slides 


##### Template Base to construct a slide

```html
<form-slide class="slides">
  <section-item>
    <h1>Presentación 1</h1>
    <h3>The HTML Presentation Framework</h3>
    <p>
      <small>Created by <a href="http://hakim.se">Hakim El Hattab</a> / <a href="http://twitter.com/hakimel">@hakimel</a></small>
    </p>
  </section-item>
</form-slide>
```
- This a custom HTML tag to wrapp the each one of the slides
```html
<form-slide class="slides"></form-slide>
```

- This a custom HTML tag to wrap the content of one slide
```html
<section-item> class="slides"></section-item>
```

<br/>

##### Also it can add to this components <br/>

> This components can transmit events on real time to spectators 

- Checklist: <br/>
  This component transmit a event when is clicked some a item of list.
```html
<check-list>
  <item-list item-text="Esto es una muestra de un item"></item-list>
  <item-list item-text="Otro ejemplo de un item"></item-list>
</check-list>
```

- Circle Chart: <br/>
  This component transmit a event when is mouse hover some the point/slice of chart.
```html
<circle-chart data="[300, 500, 100]" labels="['Download Sales', 'In-Store Sales', 'Mail-Order Sales']" colors="['#003d1e', '#01963a', '#9fe247']"></circle-chart>
```
