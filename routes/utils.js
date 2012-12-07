
exports.jqtpl = function (req, res) {
    res.render("../public/javascripts/uicontrols/" + req.query["uiname"] + ".jqtpl.ejs", {layout: false});
};
