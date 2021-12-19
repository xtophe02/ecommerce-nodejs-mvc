# NodeJS Ecommerce Models Viewers Controlers

short description what the APP does:

**Authentication**

- signup
- login/logout
  only logged in you can add products and or buy products
- password reset
  you will receive an email to reset your password

**ADD/EDIT/DELETE Products**
any user can add products, and only this user can EDIT/DELETE his own product

**Cart**
you can add products to the cart and then order with stripe

**Orders**
you can get all your orders as pdf

**ERROR handling**
handling 404 and 500 pages

**pagination**
used mongo pagination to load the products into chucks

**packages used**

- docker
  to run 2x processes at sime time, nodejs and mongo
- nodejs
  the backend server
- mongodb
  the database
- mongoose
  mongodb friendly user, able to create models
- express
  to create a web server over nodejs
- express-session
  create session cookies to diferenciate users
- express-validator
  to check inputs
- connect-mongo
  to save sessions on database
- EJS
  template engines to render html pages
- multer
  to save files localy
- flash
  to add notifications
- pdfkit
  to generate pdfs
- stripe
  for card payments
- sendgrid
  send emails from the app
