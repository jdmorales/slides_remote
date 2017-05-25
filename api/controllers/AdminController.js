/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  viewLiveSlides : function (req, res) {
    //var method = req.route.method;
    var document = {
      currentView : "liveSlides"
    };

    res.view('admin/liveSlides', {layout: 'layout_admin', document: document});
  },


  liveSlides : function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var search = {
      published : true
    };

    sails.sockets.join(req, 'roomSlidesLive');

    Slide.find(search).exec(function (err, liveSlides) {

      if(err){
        return res.badRequest(err);
      }

      if(liveSlides){
        return res.ok(liveSlides);
      }else{
        return res.badRequest(err);
      }

    });

  },

  mySlides  : function (req, res) {

    var document ={
      currentView : "mySlides"
    };

    if(req.session.authenticated) {
      Slide.find({userId:req.session.User.id}).exec(function (err, slides) {
        document['slides'] = slides;

        res.view('admin/mySlides',{layout:'layout_admin',  document : document});
      });

    }else{
      res.view('admin/mySlides',{layout:'layout_admin',  document : document});
    }

  },

  viewCreateSlides  : function (req, res) {
    var document ={
      currentView : "createSlides"
    };
    res.view('admin/createSlides',{layout:'layout_admin',  document : document});
  },

  createSlide  : function (req, res) {

    var slide = {
      userId: req.session.User.id,
      title: req.param('title'),
      slug: req.param('title'),
      description: req.param('description'),
      template: req.param('template')
    };

    Slide.create(slide).exec(function (err, newSlide) {

      if (err) {
        return res.badRequest(err);
      }

      Slide.publishCreate(_.omit(newSlide, 'template'), req );

      return res.ok();
    })



  },


  viewEditeSlide : function (req, res) {

    var document = {
      currentView : "updateSlides"
    };

    var search = {
      slug   : req.param('slug'),
      userId : req.session.User.id
    };

    Slide.findOne(search).exec(function (err,slide) {

      if(err){
        return res.redirect("admin/mySlides");
      }

      if(slide){
        document.slide = slide;
        return res.view('admin/editeSlide',{layout:'layout_admin', document : document});
      }else{
        return res.badRequest();
      }
    });
  },

  editeSlide : function (req, res) {

    var search  = {
      id          : req.param('idSlide'),
      userId      : req.session.User.id,
    };

    var updateSlide = {
      title       : req.param('title'),
      description : req.param('description'),
      template    : req.param('template')
    };

    Slide.update(search,updateSlide).exec(function (err, newSlide) {

      if (err) {
        return res.badRequest(err);
      }

      return res.ok();
    })

  },

  getSlide  : function (req, res) {

    var userId = req.session.User.id;

    var search = {
      id   : req.param('id'),
    };

    Slide.findOne(search).exec(function (err,slide) {

      if (err) {
        return res.badRequest();
      }

      if (slide) {
        var document = {
          slide: slide
        };
        return res.ok(document)
      }

    });

  },


  publishSlide : function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var search = {
      id :  req.param('id'),
    };

    var updateData = {
      published : req.param('published'),
      activeUsers : []
    };


    Slide.update(search,updateData).exec(function (err, updateSlide) {

      if (err) {
        return res.badRequest(err);
      }

      var Message = {
        verb :  '',
        data :  _.omit(updateSlide[0], 'template')
      };

      var changes = {
        action :  '',
        data   :  Message.data
      };

      if(updateData.published){
        Message.verb   = 'online';
        changes.action = 'onlineSlide';
        sails.sockets.broadcast('roomSlidesLive','slideLive', Message);
      }else{
        Message.verb   = 'offline';
        changes.action = 'offlineSlide';
        sails.sockets.broadcast('roomSlidesLive','slideLive', Message);
      }

      Slide.publishUpdate(updateSlide[0].id, changes);

      return res.ok(updateSlide);
    });

  },

  getSessionUser : function (req, res) {

    var search = {
      id   : req.session.User.id
    };

    User.findOne(search).exec(function (err, user) {

      if (err) {
        return res.badRequest(err);
      }

      if(user){
        return res.ok(user.toJSON());
      }

    });

  }

};

