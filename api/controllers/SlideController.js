/**
 * SlideController
 *
 * @description :: Server-side logic for managing slides
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  viewPreviewSlide : function (req, res) {

    var document = {
      currentView : "previewSlide"
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
        if(slide.userId == search.userId) {

          if (!slide.published) {

            User.findOne({id: slide.userId}).exec(function (err, user) {

              if (err) {
                return res.badRequest(err);
              }

              if(user){
                document.slide = slide;
                return res.view('app/viewSlide', {layout: 'layout_app', document : document, user : user.toJSON() })
              }

            });

          } else {
            console.log("viewPreviewSlide", "Está publicado");
            return res.redirect("/app/live_slide/" + slide.slug);
          }

        }else{
          console.log("viewPreviewSlide", "Usuario no es el mismo")
          return res.redirect("admin/mySlides");
        }
      }else{
        console.log("viewPreviewSlide", "No encontró slide")
        return res.redirect("admin/mySlides");
      }
    });

  },

  viewLiveSlide : function (req, res) {

    var userId = req.session.User.id;

    var document = {
      currentView : "liveSlide"
    };

    var search = {
      slug   : req.param('slug')
    };

    Slide.findOne(search).exec(function (err,slide) {

      if(err){
        return res.redirect("admin/mySlides");
      }

      if(slide){

        if(slide.published){

          var admin;

          User.findOne({id: slide.userId}).exec(function (err, authorUser) {

            if (err) {
              return res.badRequest(err);
            }

            if(authorUser){
              document.slide  = slide;
              document.author = authorUser.toJSON();

              User.findOne({id: userId}).exec(function (err, viewerUser) {
                return res.view('app/viewSlide', {layout: 'layout_app', document : document, user : viewerUser.toJSON() })
              });

            }

          });

        }else if(userId == slide.userId) {
          console.log("viewliveSlide", "No Está publicado y es Admin del Slide");
          return res.redirect("app/preview_slide/" + slide.slug);
        }else{
          console.log("viewliveSlide", "No Está publicado");
          return res.redirect("admin/mySlides");
        }
      }else{
        console.log("viewliveSlide", "No encontró slide");
        return res.redirect("admin/mySlides");
      }

    });

  },

  suscribeLiveSlide : function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var search = {
      id : req.param('id')
    };

    var userId = req.session.User.id;

    var subscribe = req.param('subscribe');


    Slide.findOne(search).exec(function (err, slide) {

      if(err){
        return res.badRequest();
      }

      if(slide){

        Slide.subscribe(req,search.id);

        if(userId !== slide.userId){

          if(subscribe) {

            slide.pushActiveUsers(userId, function (err, user) {

              if(err){
                console.log(err)
              }

              if(user){

                var changes = {
                  action :  "subscribeUser",
                  data : user
                };

                Slide.publishUpdate(slide.id, changes);

              }

            });

          } else {

            slide.deleteActiveUsers(userId, function (err, user) {

              if(err){
                console.log(err)
              }

              if(user){
                var changes = {
                  action :  "unsubscribeUser",
                  data : user
                };

                Slide.publishUpdate(slide.id, changes);

              }

            });

          }

        }else{
          return res.ok("Eres el admin");
        }

      }

    });

  },

  getLiveSlide : function (req, res) {

    var userId = req.session.User.id;

    var search = {
      slug   : req.param('slug')
    };

    Slide.findOne(search).exec(function (err,slide) {

      if(err){
        return res.badRequest();
      }

      if(slide) {

        User.findOne({id: slide.userId}).exec(function (err, authorUser) {

          if (err) {
            return res.badRequest(err);
          }

          if (authorUser) {
            User.findOne({id: userId}).exec(function (err, viewerUser){

              var document = {
                slide  : slide,
                author : authorUser.toJSON(),
                user   : viewerUser.toJSON()
              };

              return res.ok(document)
            });

          }

        });

      }

    });

  },

  changeStatusSlide : function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var search = {
      id     : req.param('idSlide'),
      userId : req.session.User.id
    };

    var updateSlide = {
      currentSlide : req.param('currentSlide')
    };


    Slide.update(search, updateSlide).exec(function (err, newSlide) {

      if(err){
        return res.badRequest(err);
      }

      if(newSlide){

        var changes  = {
          action : 'changeStateSlide',
          data   : {
            currentSlide : newSlide[0].currentSlide,
            userId : search.userId
          }
        };

        Slide.publishUpdate(newSlide[0].id, changes, req);

        return res.ok();
      }

    });

  },

  changeStatusComponent : function (req, res) {

    if (!req.isSocket) {
      return res.badRequest();
    }

    var search = {
      id     : req.param('idSlide'),
      userId : req.session.User.id
    };

    var updateSlide = {
      component : req.param('component')
    };


    Slide.findOne(search).exec(function (err,slide) {

      if(err){
        return res.badRequest(err);
      }

      if(slide){

        var changes  = {
          action : 'changeComponent',
          data   : {
            component : updateSlide.component,
            userId : search.userId
          }
        };


        Slide.publishUpdate(slide.id, changes, req);

        return res.ok();
      }

    });

  }

};
