/*
	Testing class utilities
 */
(function () {
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
			setup(function () {
				spy = sinon.spy(GA, 'extend');
				mergedObj = GA.extend({}, obj1, obj2);
			});
			
			test('returns an object', function () {
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
				assert.equal(returnObj.hello, 'is not the world', '');
			});

			teardown(function () {
				mergedObj = '';
				spy.restore();
			});

		});

		suite("loadProviders() - loading providers", function () {
			var spyLoad;
			setup(function () {
				spyLoad = sinon.spy(GA, 'loadProviders');
			});

			// test('provider not found', function () {
			// 	GA.loadProviders({
			// 		'Goole': {
			// 			'trackingId': 'UA-XXXXXX-X',
			// 			'domain': 'example',
			// 			'debug': true
			// 		}
			// 	});
			// 	expect(GA.loadProviders).to.throw('Sorry, no provider with the name of "Goole" is available');
			// });

			teardown(function () {
				spyLoad.restore();
			});
		});

	});
})();
