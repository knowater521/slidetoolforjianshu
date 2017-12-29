// import EventHandler from './eventsHandler';

function ExtendedSideTool(){
    this.inInner=0;
    //extendedSideTool类
    this.setAttribute={
        slideBar(bar,a,b){
            let radio = a/b;
            let length = radio*a;
            bar.classList.add('bar');
            bar.style.height=`${length.toFixed(2)}px`;
            this.radio=radio.toFixed(3);
            bar.style.transform=`translateY(0px)`;
        },
        navFrame(navFrame){
            //用来设置新的LI
            //输入值 LI
            //输出 无
            navFrame.id='$navFrame';
            let aNode=document.createElement('a');
            aNode.setAttribute('class','function-button');
            navFrame.appendChild(aNode);
            navFrame.setAttribute('data-placement','left');
            navFrame.setAttribute('data-toggle','tooltip');
            navFrame.setAttribute('data-container','body');
            navFrame.setAttribute('data-placement','left');
            var that = this;
            navFrame.addEventListener('mouseover',function(e){
                that.main.style.display="block";
            },{passive:true})
            // navFrame.addEventListener('mouseout',function(e){
            //     // that.main.style.display="none";
            // },{passive:true})
            this.main.addEventListener('animationend',function(e){
                if(e['animationName']==='mainOut'){
                    // that.main.style.display='none';
                }
            })
        },
        main(main){
            //用来设置新的DIV
            //输入值 DIV
            //输出 无
            main.classList.add('rolling');
            let heightOfSildeTools = document.querySelector('.side-tool')['clientHeight'];
            main.style.cssText+=`height:${heightOfSildeTools*(3/2)}px;display:none;`;
            
            
        },
        bind(that){
            this.navFrame= this.navFrame.bind(that);
            this.main= this.main.bind(that);
            this.slideBar=this.slideBar.bind(that);
        }
    }
    this.setAttribute.bind(this);
    this.navFrame=document.createElement('li');
    this.main = document.createElement('div');
    var that=this;
    var handleScroll=function(e){
        e.preventDefault();
        if(this.unableScroll){
            return;
        }
        if(e['deltaY']<0){
            let toY=this.offsetY+8;
            if(toY<=0){
                this.ul.style.transform=`translateY(${toY}PX)`
                this.offsetY+=8;
            }  
        }
        else if(e['deltaY']>0){
            let startY=this.offsetY;
            this.ul.style.transform=`translateY(${startY-8}PX)`
            this.offsetY-=8;
        }
    }
    this.main.addEventListener('mouseenter',function(){
        that.inInner++;
        window.addEventListener('wheel',handleScroll.bind(that));
    })
    this.main.addEventListener('scroll',function(e){
        e.preventDefault();
        
    })
    var inNavFrame=function(){
        this.inInner++;
        this.main.classList.remove('rollingOut');
        this.main.classList.add('rollingIn');
    }
    var dengdai=function(){
        this.inInner--;
        if(this.inInner===0){
            this.main.classList.remove('rollingIn');
            this.main.classList.add('rollingOut');
            window.onwheel=undefined;
        }
    }
    var outNavFrame=function(){
        setTimeout(dengdai.bind(that),0);
    }
    this.navFrame.addEventListener('mouseenter',inNavFrame.bind(this),{passive:true});
    this.navFrame.addEventListener('mouseleave',outNavFrame.bind(this),{passive:true});
    this.main.addEventListener('mouseleave',outNavFrame.bind(this),{passive:true});
    this.setAttribute['navFrame'](this.navFrame);
    let sideTool=document.getElementsByClassName('side-tool')[0].firstChild;
    sideTool.insertBefore(this.navFrame,sideTool.firstChild);
    this.fragment=document.createDocumentFragment();
}

ExtendedSideTool.prototype.addItem=function(index,sectionName){
    //添加一个条目
    //输入 编号 名字

    let nowLi=document.createElement('li');
    let nowA=document.createElement('a');
    nowA.innerHTML=sectionName;
    let path=location.pathname.split('/');
    let id=path[path.length-1];
    nowA.setAttribute('href',`${id}#no${index}`);
    nowLi.appendChild(nowA);
    this.fragment.appendChild(nowLi);
}

ExtendedSideTool.prototype.mount=function(){
    //装载
    let rail = document.createElement('div');
    let bar = document.createElement('div');
    this.setAttribute['main'](this.main);
    rail.appendChild(bar);
    rail.classList.add('rail');
    this.ul=document.createElement('ul');
    let ul = this.ul;
    ul.appendChild(this.fragment);
    this.offsetY=0;
    ul.style.transform=`translateY(${this.offsetY}px)`;
    let that=this;
    let hasMove=0
    let MaxDistance=parseInt(this.main.style.height)-(ul.childElementCount*(25+38));
    let handleMove=function(e){
        let moveDistance = e.clientY-that.startY+that.offsetY;
        moveDistance=Math.min(0,moveDistance);
        moveDistance = moveDistance<MaxDistance? MaxDistance:moveDistance;
        that.ul.style.transform=`translateY(${moveDistance}px)`;
        bar.style.transform=`translateY(${-moveDistance*that.radio}px)`;
        hasMove = moveDistance;
    }
    ul.addEventListener('mousedown',function(e){
        let startY=e.clientY;
        that.startY=startY;
        that.unableScroll=true;
        // window.onmousemove
        window.addEventListener('mousemove',handleMove);
        window.addEventListener('mouseup',function(){
            window.removeEventListener('mousemove',handleMove);
            that.offsetY=hasMove;
            that.unableScroll=false;
        })
    })
    ul.setAttribute('onselectstart','return false');
    ul.setAttribute('ondragstart','return false');
    ul.addEventListener('mouseup',function(e){
        window.removeEventListener('mousemove',handleMove);
        that.offsetY=hasMove;
        that.unableScroll=false;
    })
    this.main.appendChild(ul);
    this.main.appendChild(rail);
    let sideTool = document.querySelector('.side-tool');
    sideTool.appendChild(this.main);
    let scrollHeightOfUl=ul.childElementCount*(25+38);
    let heightOfMain = parseInt(this.main.style.height);
    this.setAttribute['slideBar'](bar,heightOfMain,scrollHeightOfUl);
}

function addAnchorAfterHr(){
    let extendedSideTool = new ExtendedSideTool();
    let allHr = document.querySelectorAll('div.show-content hr');
    let commonParent = document.getElementsByClassName('show-content')[0];
    for(let index=1;index<=allHr.length-1;index++){
        let nowHr = allHr[index];
        let nextSibling=nowHr.nextSibling;
        let sectionName=`第${index}部分`;
        // nowHr.name='no'+index;
        nowHr.setAttribute('name','no'+index);
        nowHr.setAttribute('id','no'+index);
        if((nextSibling.nodeName.toLocaleLowerCase) in ['h1','h2','h3']){
            let headConetnt = nextSibling.textContent;
            sectionName=sectionName+'----'+headConetnt;
        }
        extendedSideTool.addItem(index,sectionName);
    }
    extendedSideTool.mount();
}

setTimeout(addAnchorAfterHr,1500);