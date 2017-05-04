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
      type : 'array'
    }

  },

  // Lifecycle Callbacks
  beforeCreate: function (values, cb) {
     values.slug = camelcase(values.title);
     cb();
  },

  beforeUpdate: function (values, cb) {
     values.slug = camelcase(values.title);
    
     cb();
  }

};

