module('CSS resolver');
test('Vendor prefixes extraction', function() {
	var css = zen_coding.require('cssResolver');
	
	deepEqual(css.extractPrefixes('-transform'), {property: 'transform', prefixes: 'all'}, 'All prefixes for "transform" property');
	deepEqual(css.extractPrefixes('-w-transform'), {property: 'transform', prefixes: ['w']}, 'Webkit prefix for "transform" property');
	deepEqual(css.extractPrefixes('-wom-transform'), {property: 'transform', prefixes: ['w', 'o', 'm']}, 'Webkit, Opera and Mozilla prefix for "transform" property');
	deepEqual(css.extractPrefixes('box-sizing'), {property: 'box-sizing', prefixes: null}, 'No prefixes for "box-sizing" property');
	deepEqual(css.extractPrefixes('float'), {property: 'float', prefixes: null}, 'No prefixes for "float" property');
});

test('Value extraction', function() {
	var css = zen_coding.require('cssResolver');
	
	equal(css.findValuesInAbbreviation('padding10'), '10', 'Extracted value from "padding10"');
	equal(css.findValuesInAbbreviation('padding10-10'), '10-10', 'Extracted value from "padding10-10"');
	equal(css.findValuesInAbbreviation('padding-10-10'), '-10-10', 'Extracted value from "padding-10-10"');
	equal(css.findValuesInAbbreviation('padding1.5'), '1.5', 'Extracted value from "padding1.5"');
	equal(css.findValuesInAbbreviation('padding.5'), '.5', 'Extracted value from "padding.5"');
	equal(css.findValuesInAbbreviation('padding-.5'), '-.5', 'Extracted value from "padding-.5"');
});

test('Value parsing', function() {
	var css = zen_coding.require('cssResolver');
	
	deepEqual(css.parseValues('5'), ['5'], 'Parsed value "10"');
	deepEqual(css.parseValues('10'), ['10'], 'Parsed value "10"');
	deepEqual(css.parseValues('10-10'), ['10', '10'], 'Parsed value "10-10"');
	deepEqual(css.parseValues('10em10px'), ['10em', '10px'], 'Parsed value "10em10px"');
	deepEqual(css.parseValues('10em-10px'), ['10em', '-10px'], 'Parsed value "10em-10px"');
	deepEqual(css.parseValues('10em-10px10'), ['10em', '-10px', '10'], 'Parsed value "10em-10px10"');
	deepEqual(css.parseValues('10-10--10'), ['10', '10', '-10'], 'Parsed value "10-10--10"');
	deepEqual(css.parseValues('1.5'), ['1.5'], 'Parsed value "1.5"');
	deepEqual(css.parseValues('.5'), ['.5'], 'Parsed value ".5"');
	deepEqual(css.parseValues('-.5'), ['-.5'], 'Parsed value "-.5"');
	deepEqual(css.parseValues('1.5em-.5'), ['1.5em', '-.5'], 'Parsed value "1.5em-.5"');
});

test('Value normalization', function() {
	var css = zen_coding.require('cssResolver');
	
	equal(css.normalizeValue('10'), '10px', 'Normalized value 10');
	equal(css.normalizeValue('10p'), '10%', 'Normalized value 10');
	equal(css.normalizeValue('1.5'), '1.5em', 'Normalized value 1.5');
	equal(css.normalizeValue('-.5'), '-.5em', 'Normalized value -.5');
	equal(css.normalizeValue('-.5p'), '-.5%', 'Normalized value -.5');
});

test('Abbreviation expanding', function() {
	var css = zen_coding.require('cssResolver');
	
	equal(css.expandToSnippet('padding5'), 'padding: 5px;', 'Expanded "padding5"');
	equal(css.expandToSnippet('-transform'), '-webkit-transform: ${0};\n-moz-transform: ${0};\n-ms-transform: ${0};\n-o-transform: ${0};\ntransform: ${0};', 'Expanded "-transform"');
	equal(css.expandToSnippet('-pos-a'), '-webkit-position: absolute;\n-moz-position: absolute;\n-ms-position: absolute;\n-o-position: absolute;\nposition: absolute;', 'Expanded "-pos-a"');
	equal(css.expandToSnippet('pos-a'), 'position: absolute;', 'Expanded "pos-a" (no processing)');
});

test('important declaration', function() {
	var css = zen_coding.require('cssResolver');
	
	equal(css.expandToSnippet('pos-a!'), 'position: absolute !important;', 'Expanded "pos-a" with !important');
	equal(css.expandToSnippet('padding5!'), 'padding: 5px !important;', 'Expanded "padding5" with !important');
	equal(css.expandToSnippet('-transform!'), '-webkit-transform: ${0} !important;\n-moz-transform: ${0} !important;\n-ms-transform: ${0} !important;\n-o-transform: ${0} !important;\ntransform: ${0} !important;', 'Expanded "-transform" with !important');
});