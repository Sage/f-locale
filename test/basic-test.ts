import { assert } from 'chai';
import { locale } from '../src';

const resources = locale.resources(__filename);

describe('basic test', () => {
	it('can set and get current locale', () => {
		locale.current = 'en';
		assert.equal(locale.current, 'en');
		locale.current = 'fr';
		assert.equal(locale.current, 'fr');
	});
	it('can get simple messages', () => {
		locale.current = 'en';
		assert.equal(resources.message('simple'), 'this is simple');
		locale.current = 'fr';
		assert.equal(resources.message('simple'), 'c\'est simple');
		assert.equal(resources.message('simple', 'en'), 'this is simple');
	});
	it('can format', () => {
		locale.current = 'en';
		assert.equal(resources.format('complex', 'hello', 'world'), 'first: hello, second: world');
		locale.current = 'fr';
		assert.equal(resources.format('complex', 'bonjour', 'monde'), 'second: monde, premier: bonjour');
	});
});
