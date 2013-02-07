/*
	Testing class utilities
 */
(function () {
	suite('Test Utilities', function () {
		test('Remove whitespace from beginning of string', function () {
			var cleanValue = GA.cleanValue('   hello world');
			assert.equal(cleanValue, 'hello world', 'whitespace wasn\'t removed from the beginning of the string');
		});
		test('Remove whitespace from end of string', function () {
			var cleanValue = GA.cleanValue('hello world   ');
			assert.equal(cleanValue, 'hello world', 'whitespace wasn\'t removed from the end of the string');
		});
		test('Remove whitespace from beginning and  end of string', function () {
			var cleanValue = GA.cleanValue(' hello ');
			assert.equal(cleanValue, 'hello', 'whitespace wasn\'t removed');
		});
	});
})();
