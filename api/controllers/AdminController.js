/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	loadSlides : function (req, res) {
    res.view('admin/homepage',{layout:'layout_admin'});
  }
};

