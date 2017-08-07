/** nodeList.forEach polyfill... Edge and IE don't have this */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/**
 *
 */
class Dbox {

    /**
     *
     * @param element
     * @param dialogBox
     * @param modal
     */
    constructor({ element = '.dbox', dialogBox = '#js-dbox', modal = false } = {} ) {

        this.element = document.querySelectorAll(element);
        this.dialogBox = document.querySelector(dialogBox);
        this.modal = modal;

        this.lbImage = this.dialogBox.getElementsByTagName('img')[0];
        this.lbCaption = this.dialogBox.getElementsByTagName('p')[0];

    }


    /**
     * open our dialog box, set the image attribute and the caption text
     * @param element
     */
    open(element) {

        this.insertImage(element);
        this.dialogBox.showModal();
    }

    /**
     * Close the Dialog. If it's a modal only let the button be clicked to close it
     */
    closeDialog() {
        if (this.modal) {
            this.closeButton = this.dialogBox.querySelector('button');

            this.closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.dialogBox.close();
                this.removeImage();
            });
        } else {
            this.dialogBox.addEventListener('click', (e) => {
                e.preventDefault();
                this.dialogBox.close();
                this.removeImage();
            });
        }
    }

    /**
     *
     * @param element
     */
    insertImage(element) {
        this.lbImage.setAttribute("src", element.getAttribute("href"));
        this.lbImage.setAttribute("alt", element.querySelector("img").getAttribute("alt"));

        this.insertLightboxCaption(element);


        this.updateDialogBG(this.dialogBox, element.querySelector('img'));
    }


    /**
     *
     * @param element
     * @returns {string}
     */
    insertLightboxCaption(element) {
        // see if the parent element - ie a figure element contains a figcaption
        // const isFigcaption = element.parentNode.querySelector('figcaption');
        //
        // if (isFigcaption.textContent.trim().length !== 0) {
        //     this.lbCaption.textContent = isFigcaption.textContent;
        // } else {
        //     this.lbCaption.textContent = element.querySelector("img").getAttribute("alt");
        // }
        return this.lbCaption.textContent = element.querySelector("img").getAttribute("alt");
    }


    /**
     * remove the image from the image tag in the dialog box
     */
    removeImage() {
        this.lbImage.setAttribute('src', '');

    }


    /**
     *
     * @param image
     */
    getThumbColor(image) {

        const colorThief = new ColorThief();
        // return 'rgb(' + colorThief.getColor(image) + ')';
        return colorThief.getColor(image);
    }

    /**
     *
     * @param element
     * @param image
     */
    updateDialogBG(element, image) {

        const color = this.getThumbColor(image);

        const captionBGToUpdate = element.querySelector('.dbox-dialog--container');
        // test for image bg color
        const imgBGToUpdate = element.querySelector('img');

        imgBGToUpdate.style.backgroundColor = 'rgb(' + color + ')';
        captionBGToUpdate.style.backgroundColor = 'rgb(' + color + ')';
        this.lbCaption.style.color = this.setTextContrast(color);


    }

    /**
     * get appropriate text contrast.
     * @param backgroundColor
     * @returns {string}
     *
     * https://www.w3.org/TR/AERT#color-contrast
     * Color brightness is determined by the following formula:
     * ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
     * Note: This algorithm is taken from a formula for converting RGB values to YIQ values.
     * This brightness value gives a perceived brightness for a color.
     *
     */
    setTextContrast(backgroundColor) {

        const brightness = Math.round(((parseInt(backgroundColor[0]) * 299) +
            (parseInt(backgroundColor[1]) * 587) +
            (parseInt(backgroundColor[2]) * 114)) / 1000);

        // let foreground = window.getComputedStyle(this.dialogBox.querySelector('p'), null );
        return (brightness > 125) ? '#000' : '#fff';

    }


    /**
     * run this bad b
     */
    run() {

        this.element.forEach(ele => {

            ele.addEventListener('click', (e) => {
                e.preventDefault();

                this.open(ele);

            })
        });

        this.closeDialog();

    }

}