export default class DrawableCanvas{
    constructor(canvasElement, penColor = "red"){
        this.canvas = canvasElement;
        this.penColor = penColor;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("mousemove", this.onMouseMove, false);
	    this.canvas.addEventListener("mousedown", this.onMouseDown, false);        
        this.canvas.addEventListener("mouseup", this.onMouseUp, false);       
        this.painting = false;
        this.prevPos = null;
        this.currPos = null;
        this.clear();    
    }
    clear(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        
    }    
    onMouseMove=(e)=>{
        if(!this.painting) return;
        this.prevPos = this.currPos;
        this.currPos = this.getMousePos(e);
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevPos.x, this.prevPos.y);        
        this.ctx.lineTo(this.currPos.x, this.currPos.y);
        this.ctx.lineWidth = 15;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.penColor;        
        this.ctx.stroke();
        this.ctx.closePath();
    }
    onMouseDown=(e)=>{
        if(e.buttons!=1) return;
        this.painting = true;
        this.currPos = this.getMousePos(e);        
    }
    onMouseUp=(e)=>{
        this.painting = false;        
        this.prevPos = null;
        this.currPos = null;
    }
    getMousePos=(event)=>{        
        var rect = this.canvas.getBoundingClientRect();        
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;        
        return {x,y};
    }
    getImageTensor(targetWidth=28, targetHeight=28){
        var raw = tf.browser.fromPixels(this.canvas,1);//1 channel
	    var resized = tf.image.resizeBilinear(raw, [28,28]);
        var tensor = resized.expandDims(0);
        return tensor;
    }
}