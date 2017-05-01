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
    res.view('admin/mySlides',{layout:'layout_admin',  document : document});
  }

};

