
/**
 * Module dependencies.
 */

var dox = require('../')
  , should = require('should')
  , fs = require('fs');

function fixture(name, fn) {
  fs.readFile(__dirname + '/fixtures/' + name, 'utf8', fn);
}

module.exports = {
  'test .version': function(){
    dox.version.should.match(/^\d+\.\d+\.\d+$/);
  },
  
  'test .parseComments() blocks': function(){
    fixture('a.js', function(err, str){
      var comments = dox.parseComments(str);
      comments.should.have.length(2);

      var file = comments.shift()
        , version = comments.shift();

        file.should.have.property('ignore', true);
        file.content.should.equal('<p>A\nCopyright (c) 2010 Author Name &lt;Author Email&gt;\nMIT Licensed</p>');
        file.description.should.equal('<p>A\nCopyright (c) 2010 Author Name &lt;Author Email&gt;\nMIT Licensed</p>');
        file.body.should.equal('');
        file.tags.should.be.empty;

        version.should.have.property('ignore', false);
        version.content.should.equal('<p>Library version.</p>');
        version.description.should.equal('<p>Library version.</p>');
        version.body.should.equal('');
        version.tags.should.be.empty;
    });
  },
  
  'test .parseComments() tags': function(){
    fixture('b.js', function(err, str){
      var comments = dox.parseComments(str);
      comments.should.have.length(2);

      var version = comments.shift();
      version.content.should.equal('<p>Library version.</p>');
      version.description.should.equal('<p>Library version.</p>');
      version.tags.should.have.length(2);
      version.tags[0].type.should.equal('type');
      version.tags[0].types.should.eql(['String']);
      version.tags[1].type.should.equal('api');
      version.tags[1].visibility.should.equal('public');

      var parse = comments.shift();
      parse.description.should.equal('<p>Parse the given <code>str</code>.</p>');
      parse.body.should.equal('<h2>Examples</h2>\n\n<p>   parse(str)\n   // =&gt; "wahoo"</p>');
      parse.content.should.equal('<p>Parse the given <code>str</code>.</p>\n\n<h2>Examples</h2>\n\n<p>   parse(str)\n   // =&gt; "wahoo"</p>');
      parse.tags[0].type.should.equal('param');
      parse.tags[0].name.should.equal('str');
      parse.tags[0].description.should.equal('to parse');
      parse.tags[0].types.should.eql(['String', 'Buffer']);
      parse.tags[1].type.should.equal('return');
      parse.tags[1].types.should.eql(['String']);
      parse.tags[2].visibility.should.equal('public');
    });
  },
  
  'test .parseTag() @api': function(){
    var tag = dox.parseTag('@api private');
    tag.type.should.equal('api');
    tag.visibility.should.equal('private');
  },
  
  'test .parseTag() @param': function(){
    var tag = dox.parseTag('@param {String|Buffer}');
    tag.type.should.equal('param');
    tag.types.should.eql(['String', 'Buffer']);
    tag.name.should.equal('');
    tag.description.should.equal('');
  }
};