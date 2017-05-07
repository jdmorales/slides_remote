/**
 * SlideController
 *
 * @description :: Server-side logic for managing slides
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	viewPreviewSlide : function (req, res) {
	  var slug = req.param('slug');

	  //console.log(slug);

    var document = {
      currentView : "liveSlides"
    };

    res.view('app/previewSlide', {layout: 'layout_app', document: document})
  }
};

