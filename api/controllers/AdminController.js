/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  liveSlides : function (req, res) {
    var document = {
      currentView : "liveSlides"
    };
    res.view('admin/liveSlides',{layout:'layout_admin', document : document});
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

  createSlides  : function (req, res) {

    if(req.session.authenticated) {
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

        return res.ok();
      })

    }else{
      return res.badRequest();
    }

  }


};

