# f-locale

Localization helper for f-promise

`f-locale` is a companion package for [`f-promise`](https://github.com/Sage/f-promise).
It provides a small helper to manage localized messages.

## Installation

```sh
npm install --save f-locale
```

## Usage

Resources must be placed in JSON files inside a `resources` subdirectory of the current directory:

```sh
source-folder/
    resources/
        module1-en.json
        module1-fr.json
        ...
        module2-en.json
        module2-fr.json
        ...
    module1.ts
    module2.ts
```

The JSON files contain a simple object hash:

```json
{
    "simple": "a simple message",
    "complex": "a more complex message with {{0}} and {{1}} args"
}
```

`f-locale` uses [handlebars](http://handlebarsjs.com/) formatting directives.

Basic usage:

```js
import { locale } from 'f-locale';
const resources = locale.resources(module);

// setting the locale
locale.current = 'fr';
// loading a simple message
console.log(resources.message('simple'));
// formating a parameterized message
cconsole.log(resources.format('complex', 'hello', 5));
```

## License

MIT.
