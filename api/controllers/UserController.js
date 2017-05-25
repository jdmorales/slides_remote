/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Passwords = require('machinepack-passwords');


module.exports = {

  register :  function(req, res) {
    res.view('auth/register', {layout: 'layout_auth'})
  },

  create : function (req, res){

    // Encrypt a string using the BCrypt algorithm.
    Passwords.encryptPassword({
      password: req.param('password')
    }).exec({
      // An unexpected error occurred encrypting the password.
      error: function (err){
        req.session.flash={
          err: [{message: "Error Interno en el servidor"}]
        };
        return res.redirect('auth/register');
      },
      // OK.
      success: function (encryptedPassword) {

        // Create a user record in the database.
        User.create({

          username : req.param('username'),
          email: req.param('email'),
          password: encryptedPassword

        }).exec(function (err, newUser) {

          // If there was an error, we negotiate it.
          if (err) {

            if(_.isArray(err.invalidAttributes.username)){
              req.session.flash={
                err: [{message: "Nombre de usuario existente"}]
              };
            }

            if(_.isArray(err.invalidAttributes.email)){
              req.session.flash={
                err: [{message: "Ususario Existente"}]
              };
            }

            return res.redirect('auth/register');
          }

          // Otherwise, `err` was falsy, so it worked!  The user was created.
          // (maybe do other stuff here, or just send a 200 OK response)
          req.session.authenticated = true;
          delete newUser.password;

          req.session.User = newUser;

          return res.redirect("admin");

        });//</User.create>
      }
    });//</Passwords.encryptPassword>

  },

  login : function (req, res) {
    res.view('auth/login', {layout: 'layout_auth'});
  },

  access : function (req,res) {
    var password = req.param('password');
    var username = req.param('username');

    function message(message) {

      req.session.flash={
        err: [{message: message}]
      };

      return res.redirect('/');
    }

    if(password && username){

      User.findOne({
        username : username
      }).exec(function (err, user) {

        if(err){
          message("Error Interno en el Servidor");
        }


        if(user){

          // Encrypt a string using the BCrypt algorithm.
          Passwords.checkPassword({
            passwordAttempt: password,
            encryptedPassword: user.password
          }).exec({
            // An unexpected error occurred.
            error: function (err) {
              message("Error Interno en el Servidor");
            },
            // Password attempt does not match already-encrypted version
            incorrect: function () {
              message("Contraseña o Usuario incorrecto");
            },
            // OK.
            success: function (result) {

              req.session.authenticated = true;
              delete user.password;
              req.session.User = user;

              return res.redirect('admin');
            }

          });
        }else{
          message("Contraseña o Usuario incorrecto");
        }

      })

    }else{
      message("llena los campos");
    }
  },

  logout : function (req, res) {
    req.session.destroy();
    res.redirect('/');
  }
};

