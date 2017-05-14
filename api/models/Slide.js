/**
 * Slide.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var camelcase = require('camelcase');


module.exports = {

  attributes: {

    userId : {
      type    : 'string',
      required : true
    },

    title : {
      type: 'string',
      unique : true,
      required : true,
      minLength: 3
    },

    slug : {
      type : 'string',
      unique : true,
      required : true
    },

    description :{
      type: 'string',
      required : false,
      minLength: 3
    },

    template :{
      type: 'string',
      required : true,
    },

    published : {
      type : 'boolean',
      defaultsTo : false
    },

    currentSlide : {
      type : 'integer',
      defaultsTo :  0
    },

    components : {
      type : 'array',
      defaultsTo : []
    },

    activeUsers : {
      type : 'array',
      defaultsTo : []
    },

    //<------------------ Methods ------------------>

    findActiveUsers : function (userId) {
      var obj = this.toObject();

      var activeUsers = obj.activeUsers ? obj.activeUsers : [];
      var indexUser = -1;

      var userFound = activeUsers.filter(function (value, index) {
        if (value.id === userId) {
          indexUser = index;
          return true;
        } else {
          return false;
        }
      });

      return {
        user: userFound,
        index: indexUser
      };
    },

    pushActiveUsers : function (userId,cb) {

      var obj = this.toObject();
      var findActUser = this.findActiveUsers(userId);

      if(findActUser.index == -1){

        User.findOne({id : userId}).exec(function (err, user) {

          if (err) {
            cb(err, undefined);
          }

          if (user) {

            var activeUsers = obj.activeUsers ? obj.activeUsers : [] ;
            activeUsers.push(user.toJSON());

            var updateSlide = {
              activeUsers : activeUsers
            };


            Slide.update({id: obj.id }, updateSlide).exec(function (err, newSlide) {

              if(err){
                cb(err, undefined);
              }

              if(newSlide){

                var updatedSlide  = {
                  slide : newSlide[0],
                  user  : user
                };

                cb(undefined, updatedSlide);
              }

            });

          }

        })

      }else{
        cb('Ya existe este usuario', undefined)
      }

    },

    deleteActiveUsers : function (userId,cb) {

      var obj = this.toObject();
      var findActUser = this.findActiveUsers(userId);


      if(findActUser.index !== -1){

        var activeUsers = obj.activeUsers;
            activeUsers.splice(findActUser.index,1);

            //console.log("Antes de actualizar", activeUsers);

        Slide.update({id: obj.id },{ activeUsers : activeUsers } ).exec(function (err, newSlide) {

          if(err){
            cb(err, undefined);
          }

          if(newSlide){

            var updatedSlide  = {
              slide : newSlide[0],
              user  : findActUser.user
            };

            cb(undefined, updatedSlide);
          }

        });

      }else{
        cb('no existe este usuario para eliminarlo', {})
      }

    }

  },

  // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
    values.slug = camelcase(values.title);
    cb();
  },

  beforeUpdate: function (values, cb) {

    if(values.title){
      values.slug = camelcase(values.title);
    }

    cb();
  }




};

