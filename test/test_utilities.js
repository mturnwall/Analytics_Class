/*
	Testing class utilities
 */
(function () {
	var obj1 = {
			hello: 'world',
			world: 'hello'
		},
		obj2 = {
			testing: 'objects',
			hello: 'is not the world'
		},
		mergedObj,
		spy;
	// console.log(obj1);
	suite('Test Utilities', function () {

		suite('cleanValue() - removing whitespace', function () {
			test('removes whitespace from beginning of string', function () {
				var cleanValue = GA.cleanValue('   hello world');
				assert.equal(cleanValue, 'hello world', 'whitespace wasn\'t removed from the beginning of the string');
			});
			test('removes whitespace from end of string', function () {
				var cleanValue = GA.cleanValue('hello world   ');
				assert.equal(cleanValue, 'hello world', 'whitespace wasn\'t removed from the end of the string');
			});
			test('removes whitespace from beginning and  end of string', function () {
				var cleanValue = GA.cleanValue(' hello ');
				assert.equal(cleanValue, 'hello', 'whitespace wasn\'t removed');
			});
		});

		suite('extend() - merging objects', function () {
			setup(function () {
				spy = sinon.spy(GA, 'extend');
				mergedObj = GA.extend({}, obj1, obj2);
			});
			
			test('returns an object', function () {
				console.log(spy.args);
				assert.isObject(mergedObj, 'mergedObj is an object');
			});

			test('objects merged correctly and a new object was created', function () {
				var returnObj = {
					hello: 'is not the world',
					world: 'hello',
					testing: 'objects'
				};
				assert.equal(spy.returned(returnObj), true, 'object not merged correctly');
			});

			test('original obj1 is modified with properties from obj2', function () {
				var returnObj = GA.extend(obj1, obj2);
				console.log(returnObj.hello);
				assert.equal(returnObj.hello, 'is not the world', '');
			});



			teardown(function () {
				mergedObj = '';
				spy.restore();
			});

		});

	});
})();
