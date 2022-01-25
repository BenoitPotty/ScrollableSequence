class ScrollableSequence {
  
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.replacementToken = '{framenumber}';
  }

  init = () => {
    this.documentElement = document.documentElement;
  
    this.canvasElement = document.getElementById(this.canvasId);
    if (!this.canvasElement) {
      throw `Canvas HTMLElement with id ${this.canvasId} was not found.`;
    }
    
    this.frameCount = this.canvasElement.dataset.framecount;
    if (!this.frameCount) {
      throw `data-framecount attribute not set on the canvas.`;
    };
    
    this.imagePath = this.canvasElement.dataset.imagepath;
    if (!this.imagePath) {
      throw `data-imagepath attribute not set on the canvas`;
    } else if (!this.imagePath.includes(this.replacementToken)){
      throw `Replacement token ${this.replacementToken} not found in the imagePath`;
    }
    
    
    this.frameNumberPading = Number.parseInt(this.canvasElement.dataset.framenumberpading);
    if (!this.frameNumberPading) this.frameNumberPading = 0;
    
    this.canvasContext = this.canvasElement.getContext("2d");
    
    this.preloadImages();

    this.positionCanvasRelativelyToItsParent();
  
    this.sizeCanvasToParentSize();
  
    this.buildFirstImage();
  
    this.subscribeToScrollEvent();

    this.subscribeToWindowResize();
  };


  positionCanvasRelativelyToItsParent() {
    this.canvasElement.style.position = 'relative';
    this.canvasElement.style.top = 0;
    this.canvasElement.style.left = 0;
  }

  preloadImages = () => {
    for (let i = 1; i < this.frameCount; i++) {
      const img = new Image();
      img.src = this.buildImageName(i);
    }
  };
  
  buildImageName = (index) => {
    return `${this.imagePath.replace(this.replacementToken, index.toString().padStart(this.frameNumberPading, '0'))}`;
  };
  
  updateImage = (index) => {
    this.imageObject.src = this.buildImageName(index);
    this.drawImageToFit();
  };
  
  buildFirstImage = () => {
    this.imageObject = new Image();
    this.imageObject.src = this.buildImageName(1);
    this.imageObject.onload = () => {
      this.drawImageToFit();
    };
  };

  drawImageToFit() {
    var scale = Math.min(this.canvasElement.width / this.imageObject.width, this.canvasElement.height / this.imageObject.height);
    var x = (this.canvasElement.width / 2) - (this.imageObject.width / 2) * scale;
    var y = (this.canvasElement.height / 2) - (this.imageObject.height / 2) * scale;
    this.canvasContext.drawImage(this.imageObject, x, y, this.imageObject.width * scale, this.imageObject.height * scale);
  }
  
  subscribeToScrollEvent = () => {
    window.addEventListener("scroll", () => {
      const scrollTop = this.documentElement.scrollTop;
      const maxScrollTop = this.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        this.frameCount - 1,
        Math.ceil(scrollFraction * this.frameCount)
      );
  
      requestAnimationFrame(() => this.updateImage(frameIndex + 1));
    });
  };

  subscribeToWindowResize = () => {
    window.addEventListener("resize", () => {
      this.sizeCanvasToParentSize();
      this.drawImageToFit();
    });
  }
  
  sizeCanvasToParentSize = () => {
    this.canvasElement.width = this.canvasElement.parentElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.parentElement.offsetHeight;
  }
}