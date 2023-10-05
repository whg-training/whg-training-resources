---
sidebar_position: 3
---

# Javascript

You don't need to install javascript - you have it already in your browser. To have a go at using
it, all you need is an html file to wrap it in that your browser can understand. Something like
this:

```
<!DOCTYPE html>
<html>
<head>
  <script>
    // Your code goes here.
    console.log( "This is my code!" ) ;
  </script>
</head>
<body>
  <h1>A webpage</h1>
</body>
</html>
```

(Try creating a new file called `test.html` with the above contents and opening it in your browser.)

The file above is the standard structure of an HTML document.  It has a `DOCTYPE` declaration, followed by an `html`
element that contains everything else.  The `head`, and `body` elements go inside. Visible elements (like `h1` above)
are put inside the `body`, and javascript code and other things can go inside `head` or `body`.
    
If you run the above you might be a bit underwhelmed - you won't see the 'This is my code!' message being printed
anywhere. To see it you need to turn on the javascript console. This is done by enabling the 'developer tools' which you
can do in the browser preferences. Once this is on, you can go to the `Develop` -> `Show Javascript console` and you
should see your message.
    
Javascript is interesting to write because

* It's right there in your browser
* It's pretty fast and flexible.
* It is great at manipulating stuff on webpages.
* It has a bunch of interesting features (for example *prototypal inheritance*) that make it a bit different to other languages.

It's also very well documented - see the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) for
example.

For example, here's an HTML page that uses javascript to draw a rectangle in an [svg
element](https://developer.mozilla.org/en-US/docs/Web/SVG) on the screen:
```
<!DOCTYPE html>
<html>
<head>
  <script>

    // This calls says 'run the code below once the page has loaded'
    window.addEventListener( "load", function() {
      console.log( "Starting my drawing!" ) ;
      // create an svg element to draw in
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute( 'width', 220 ) ;
      svg.setAttribute( 'height', 120 ) ;

      // Add a border so we can see it
      svg.setAttribute( 'style', 'border: 5px solid black; border-radius: 15px;' ) ;
      
      // Create a rectangle
      let rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rectangle.setAttribute( 'x', 10 ) ;
      rectangle.setAttribute( 'y', 10 ) ;
      rectangle.setAttribute( 'width', 200 ) ;
      rectangle.setAttribute( 'height', 100 ) ;
      rectangle.setAttribute( 'fill', "grey" ) ;

      // Add the rectangle to the svg
      svg.appendChild( rectangle ) ;

      // Add the svg to the document
      document.body.appendChild( svg ) ;

      console.log( "Finished my drawing!  Added element was", svg ) ;
    }) ;
  </script>
</head>
<body>
  <h1>A rectangle</h1>
</body>
</html>
```

Save this in a file (say `test.html`) and open it in your browser. You should see a reassuringly
solid rectangle.

## Understanding the code

In fact there's a lot going on here - we have written in five different languages at once. There is:

* **HTML** which provides the overall structure of the document.
  
* **Javascript**: which the main bit of code is written in.

* The **DOM** or **document object model**, which is the abstract model of the structure of the page.  Most of the
  javascript code is interacting with the browser through the
  [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (i.e. all those calls to create elements
  and so on) **API** (application programming interface).

* **CSS**: We gave the `svg` element a 'style' attribute to give it a thick visible border. The
  syntax of that value is `CSS` ("Cascading style sheets"), another language that is all about
  visual appearance of elements.  The `setAttribute()` calls above are setting CSS attributes.
  
* **SVG**: Finally, the draw itself is in a flavour of XML known as **Scalable Vector Graphics** (SVG). That is
  a [language all to itself](https://developer.mozilla.org/en-US/docs/Web/SVG).

Once you get your head around this combination of HTML, javascript, CSS, SVG and other HTML5 features, it is a really
powerful way of building interactive visualisations. For example, here's a version that draws a circle instead, but
moves it every time you click:

```
<!DOCTYPE html>
<html>
<head>
  <script>
    window.addEventListener( "load", function() {
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute( 'width', 500 ) ;
      svg.setAttribute( 'height', 500 ) ;
      svg.setAttribute( 'style', 'border: 5px solid black; border-radius: 15px;' ) ;
      
      let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute( 'cx', 250 ) ;
      circle.setAttribute( 'cy', 250 ) ;
      circle.setAttribute( 'r', 20 ) ;
      circle.setAttribute( 'fill', "grey" ) ;
      svg.appendChild( circle ) ;

      document.body.appendChild( svg ) ;

      circle.addEventListener( 'click', function() {
           let x = parseInt(circle.getAttribute( 'x' )) ;
           circle.setAttribute( 'x', x+10 ) ;
      }) ;
      
    }) ;
  </script>
</head>
<body>
  <h1>A moving target</h1>
</body>
</html>
```

Run this in your browser and 'inspect element' to see the document structure. What happens to it
when you click the circle?
