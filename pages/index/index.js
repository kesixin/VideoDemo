//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    info: [],
    videoSrc:'',
    videoImg:'',//视频封面，缓冲时会出现黑屏，加视频封面会提升用户体验
    autoplay:true,
    touchX:0,//手指按下时x的坐标
    touchY:0,//手指按下时y的坐标
    interval:null,//计时器
    time:0,//按下到松开的时间
    current:0//swiper的当前轮播图下标
  },
  //事件处理函数
  play: function(val) {
    this.setData({ videoSrc: val.currentTarget.dataset.item.video, autoplay: false, videoImg: val.currentTarget.dataset.item.img})
  },
  //禁止视频的手动控制进度属性，监听手指移动去滑动轮播图（手指滑动轮播图和控制视频进度事件冲突）
  //手指开始触屏
  start:function(e){
    //获取触摸的原始点
    this.setData({
      touchX: e.touches.length>0 ? e.touches[0].pageX : 0,
      touchY: e.touches.length > 0 ? e.touches[0].pageY : 0 
    })
    let timeNew=this.data.time
    //开始记录时间
    this.data.interval=setInterval(()=>timeNew++,100)
    this.setData({time:timeNew})
  },
  //手指结束触屏
  end:function(e){
    let touchX = e.changedTouches.length > 0 ? e.changedTouches[0].pageX : 0
    let touchY = e.changedTouches.length > 0 ? e.changedTouches[0].pageY : 0
    let tmX = touchX - this.data.touchX
    let tmY = touchY - this.data.touchY
    if(this.data.time < 10){
      let absX = Math.abs(tmX)
      let absY = Math.abs(tmY)
      if(absX > 2*absY){
        console.log('5555')
        //滑动swiper，视频停止播放
        this.setData({
          autoplay:true,
          videoSrc:'',
          videoImg:''
        })
        if(tmX < 0){
          //左滑
          console.log('左滑')
          this.setData({
            current : this.data.current == (this.data.info.length-1) ? 0 : this.data.current+1
          })
        }else{
          //右滑
          console.log('右滑')
          this.setData({
            current : this.data.current>0 ? this.data.current-1 : this.data.info.length-1
          })
        }
      }
    }
    clearInterval(this.data.interval)
    this.setData({time:0})
  },
  handleStop:function(){
    this.setData({ videoSrc: '', autoplay: true, videoImg:''})
  },
  changeCurrent:function(e){
    //手指滑动轮播图已经在视频播放的时候做了，这里只需要做轮播图自动滚动，但是不停的调用setData可能会出现一些未知的bug，可根据需求场景设置
    if(e.detail.source == 'autoplay'){
      this.setData({current:e.detail.current})
    }
  },
  onShow: function() {
    //从后台拿回数据，写在onshow里面是因为返回此页面时，根据需求去判断是否拿swiper数据
    let info = [{
        id: '1',
        img: 'http://img4.imgtn.bdimg.com/it/u=3882508552,2527877926&fm=26&gp=0.jpg',
        type: 'video',
        video: 'https://interface.sina.cn/wap_api/video_location.d.html?cid=37766&table_id=36885&did=icezueu6231605&vt=4&creator_id=1001&vid=30447305701&video_id=304473057&r=video.sina.cn%2Fnews%2F2019-09-16%2Fdetail-iicezueu6231605.d.html&wm=30490005525198963&time=1577412073497&rd=0.018419081320328656'
      }, 
      {
        id: '2',
        img: 'http://img2.imgtn.bdimg.com/it/u=3355791600,110151422&fm=26&gp=0.jpg',
        type: 'img',
        video: ''
      },
      {
        id: '3',
        img: 'http://img3.imgtn.bdimg.com/it/u=2846566051,411513524&fm=26&gp=0.jpg',
        type: 'img',
        video: ''
      }

    ]
    this.setData({info})
  },
  onHide:function(){
    //小程序进入后台禁止轮播，防止swiper出现抽搐的bug
    this.setData({
      autoplay:false,
      videoSrc:'',
    })

  }
})