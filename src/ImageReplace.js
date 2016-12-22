/**
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
 *   @see https://github.com/Wolnosciowiec/image-replace
 */
function WolnosciowiecImageReplace (mapping, options) {

    /**
     * Mapping of real url to fallback url
     *
     * @type {Array} options
     */
    this.mapping = mapping;

    /**
     * Options eg. XMLHttpRequest url
     *
     * @type {{}}
     */
    this.options = Object.assign({
        'successCallback': function (xhr) { console.info('successCallback', xhr); },
        'failureCallback': function (xhr) { console.warn('failureCallback', xhr); },
        'url': '/report/images/send',
        'method': 'POST'
    }, options);

    /**
     * @type {WolnosciowiecImageReplace}
     */
    var imgReplace = this;

    /**
     * List of already swapped addresses
     * (to avoid infinite loop when both addresses are incorrect)
     *
     * @type {Array}
     */
    this.swappedImages = [];

    /**
     * @param {object} element
     * @returns {boolean}
     */
    this.handleImageLoadError = function (element) {

        // if the call was from the event
        if (element instanceof Event) {
            element = element.target;
        }

        if (imgReplace.mapping.hasOwnProperty(element.dataset.imageReplaceId)) {
            var targetImage = imgReplace.mapping[element.dataset.imageReplaceId];

            if (imgReplace.swappedImages.indexOf(targetImage) > -1) {
                console.warn('[WolnosciowiecImageReplace] Cannot swap image "' + element.src + '", the replacement is also not valid');
                return false;
            }

            console.log('[WolnosciowiecImageReplace] Swapped image from "' + element.src + '" to "' + targetImage + '"');
            element.src = targetImage;
            imgReplace.swappedImages.push(targetImage);

            return true;
        }

        return false;
    };

    /**
     * Send a report to the server with a list of invalid url addresses
     */
    this.sendErrorReport = function () {

        if (imgReplace.swappedImages.length === 0) {
            console.info('[WolnosciowiecImageReplace] Not sending a report, no images swapped.');
            return;
        }

        var xhr = new XMLHttpRequest();

        xhr.open(imgReplace.options.method, imgReplace.options.url, true);

        // handle the response
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4
                && xhr.status === 200
                && imgReplace.options.successCallback instanceof Function) {
                imgReplace.options.successCallback(xhr);
                return;
            }

            if (imgReplace.options.failureCallback instanceof Function) {
                imgReplace.options.failureCallback(xhr);
            }
        };

        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(imgReplace.swappedImages));
    };
}
