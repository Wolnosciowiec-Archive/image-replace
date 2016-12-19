Image Replace
=============

Technology: Vanilla JS. NO JQUERY USED.

Switches tagged images with a fall back URL on image load failure.

Example scenario:
- We hotlink a resource, but we have a cache
- Hotlinked resource expired, so we switch to our local cache
- Optionally we could send a report with an ajax call, so the server could verify those resources

```
/*
 * Wolnościowiec / Image Replace
 * -----------------------------
 *
 *   Switches tagged images with a fall back URL on image load failure.
 *   A part of an anarchist portal - wolnosciowiec.net
 *
 *   Wolnościowiec is a project to integrate the movement
 *   of people who strive to build a society based on
 *   solidarity, freedom, equality with a respect for
 *   individual and cooperation of each other.
 *
 *   We support human rights, animal rights, feminism,
 *   anti-capitalism (taking over the production by workers),
 *   anti-racism, and internationalism. We negate
 *   the political fight and politicians at all.
 *
 *   http://wolnosciowiec.net/en
 *
 *   License: LGPLv3
 *   Author: Wolnościowiec team
 *   
 *   @see https://github.com/Wolnosciowiec/web-proxy
 */
 ```

Installation via bower
======================

```
bower install wolnosciowiec-image-replace --save
```

Usage
=====

Include the library

```html
<script type="text/javascript" src="src/ImageReplace.js"></script>
```

Initialize the service *at the beginning* of the document

```js
var imgReplace = new WolnosciowiecImageReplace({
    './not-working-example.jpg': './replacement.jpg'
});
```

Add mapping and event

```html
<img
    src="./not-working-example.jpg"
    data-image-replace-id="./not-working-example.jpg"
    onerror="imgReplace.handleImageLoadError(this);">
```

Optionally add reporting

```html
<script>
    // on document load send a report
    document.addEventListener("DOMContentLoaded", function() {
        window.setTimeout('imgReplace.sendErrorReport();', 1000);
    });
</script>
```

## FAQ

1. I have different ajax call parameters, so the `imgReplace.sendErrorReport()` would not work for me

At first you could pass options in second parameter of WolnosciowiecImageReplace constructor.

Example:

```
new WolnosciowiecImageReplace({'img1': 'img-fallback', '...': '...'}, {
    'successCallback': function (xhr) { console.info('successCallback', xhr); },
    'failureCallback': function (xhr) { console.warn('failureCallback', xhr); },
    'url': '/report/images/send',
    'method': 'POST'
});
```

Other way is to overload the `WolnosciowiecImageReplace.sendErrorReport` method and write your own here.

Suggestion
==========

Could be used together with a [file repository](https://github.com/Wolnosciowiec/image-repository) and [remote resource verifier](https://github.com/Wolnosciowiec/remote-resource-verifier)