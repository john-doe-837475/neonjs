
// SPARK richtext - rich text editing control for Javascript
// Part of the SPARK Javascript library
// Copyright (c) 2010 Thomas Rutter

// A simple, reliable, easy (for users) rich text control is needed.
// Who needs a toolbar with 63 buttons when just writing some text

/*jslint browser: true, evil: true, newcap: true, immed: true */
/*global SPARK:true */

/**
@preserve SPARK js lib (c) Thomas Rutter SPARKlib.com
*/

SPARK.richText = SPARK.richText || function(opts) {

	var 
		parsereg = /([^]*?)(<(\/?)([\w!]+)(?:[^>"-]+|"[^]*?"|--[^]*?--)*>)/g,
		blockreg = /^(?:h[1-6]|ul|ol|dl|menu|dir|pre|hr|blockquote|address|center|div|isindex|fieldset|table)$/;
		//parsereg = /(<\/?)([\w!]+)(?:[^>"-]+|"[^]*?"|--[^]*?--)*>|(?:[^<]+|<[^/\w!])+/g;
		//parsereg = /[^<]+|<(\/?)([\w!]+)[^>"]*(?:"[^"]*"[^>"]*)*>?|(<!--)[\S\s]*?-->/g;

	/*
		block level: h[1-6]|ul|ol|dl|menu|dir|pre|hr|blockquote|address|center|
			p|div|isindex|fieldset|table
		optional end tag: p
		no end tag (autoclose): hr isindex
		contains paragraphs: blockquote|address|center|div|fieldset
	*/


	var htmlconvert = function(input, /*bool*/ backtohtml) {
		var
			tag,
			matches,
			output = '',
			stack = [];

		while (matches = parsereg.exec(input)) {
			// 1: text; 2: tag; 3: slash; 4: tagname

			if (matches[1] != '') {
				// deal with free text
				output += stack[stack.length-1] == 'pre' ? matches[1] :
					matches[1].replace(/\s+/, ' ');
			}

			if (matches[4]) {
				tag = matches[4].toLowerCase();
				if (blockreg.test(tag)) {
					if (!matches[3]) {
						stack.push(tag);
					}
					else if (tag == stack[stack.length-1]) {
						stack.pop();
					}
				}
				// deal with tag
				output += matches[2];
			}

			/*

			tag = matches[2] ? matches[2].toLowerCase() : null;
			if (!matches[1]) {
				if (tag==='p'||tag==='ul'||tag==='ol'||tag==='dl'||
					tag==='blockquote'||tag==='h1'||tag==='h2'||tag==='h3'||
					tag==='h4'||tag==='h5'||tag==='h6'||tag==='pre') {
					output += output !== '' ? "\n\n" : '';
				}
				else if (tag==='li'||tag==='tr'||tag==='br') {
					output += output !== '' ? "\n" : '';
				}
			}
			if (tag !== 'p' || !/<\/?p\s*>/i.test(matches[0])) {
				if (tag==='pre') {
					prelevel += matches[1] ? -1 : 1;
				}
				output += (prelevel > 0 || matches[3]) ? matches[0] :
					matches[0].replace(/\s+/, ' ');
			}
			*/
		}

		return output;
	}

	var setupeditor = function(that) {
		var
			i,
			el,
			container,
			editor,
			toolbar,
			savebar,
			source,
			canedit = document.body.contentEditable == undefined;


		for (var i = that.length; i--; ) {
			el = SPARK.select(that[i]);

			// set up editor
			container = el.insert({div:''});
			editor = container.insert(canedit ? {div:''} : {textarea:''}).
				setAttribute('contenteditable', 'true').
				addClass('SPARK-richtext-editor').
				style('border', '1px inset #aaa').
				style('padding', '1px').
				style('maxHeight', '26em').
				style('overflow', 'auto');
			if (!canedit) {
				editor.style('width', '98%').
					style('background', 'transparent').
					style('minHeight', '14em').
					style('color', 'inherit');
			}
			toolbar = editor.insert({div:''}).
				addClass('SPARK-richtext-toolbar');

			// transfer to new editor and remove old
			if (el[0].tagName.toLowerCase() == 'textarea') {
				source = el[0].value;
				editor.
					style('minWidth', el.getStyle('width')).
					style('minHeight', el.getStyle('height'));
				el.insert({
					input:'',
					$type:'hidden',
					$name:el[0].name,
					$value:''
					});
			}
			else {
				source = el[0].innerHTML;
			}
			el.remove();

			editor[0][canedit ? 'innerHTML' : 'value'] = canedit ? source :
				htmlconvert(source);
		}
	}
	
	setupeditor(this);

};
