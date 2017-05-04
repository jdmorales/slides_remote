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
        if(slide.published){
          document.message = {
            code : 1,
            text : "Slide publicado en estos momentos, no puede ser modificado"
          };
          document.slide = slide;
        }else{
          document.message = {
            code : 2,
            text : "ok"
          };
          document.slide = slide;
        }

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

  previewSlide : function (req, res) {
    res.redirect("admin")
  }


};

