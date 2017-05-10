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

          User.findOne({id: slide.userId}).exec(function (err, user) {

            if (err) {
              return res.badRequest(err);
            }

            if(user){
              document.slide = slide;
              return res.view('app/viewSlide', {layout: 'layout_app', document : document, user : user.toJSON() })
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
};

