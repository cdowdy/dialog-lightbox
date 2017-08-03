/** nodeList.forEach polyfill... Edge and IE don't have this */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

class Dbox {

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
        // register the dialog polyfill
        dialogPolyfill.registerDialog(this.dialogBox);

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

    insertImage(element) {
        this.lbImage.setAttribute("src", element.getAttribute("href"));
        this.lbImage.setAttribute("alt", element.querySelector("img").getAttribute("alt"));

        this.insertLightboxCaption(element);


        console.log(element.querySelector('img').getAttribute('src'));


        this.updateDialogBG(this.dialogBox, element.querySelector('img'));
    }

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



    updateDialogBG(element, image) {

        const v = new Vibrant(image);

        const swatches = v.swatches();

        const captionBGToUpdate = element.querySelector('.dbox-dialog--container');
        // test for image bg color
        const imgBGToUpdate = element.querySelector('img');

        if (swatches['Vibrant']) {
            imgBGToUpdate.style.backgroundColor = swatches['Vibrant'].getHex();
            captionBGToUpdate.style.backgroundColor = swatches['Vibrant'].getHex();
            this.lbCaption.style.color = swatches['Vibrant'].getBodyTextColor();

        }
        else {
            // element.style.backgroundColor = 'rgb(50, 50, 50)';
            captionBGToUpdate.style.backgroundColor = 'rgb(50, 50, 50)';
            this.lbCaption.style.color = 'rgb(255, 255, 255)';
        }
    }


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