import $ from 'jquery'
import StateMachine from 'javascript-state-machine'
import './../less/index.scss'
import data from './../data/data.json'
let fsm = []
$(function(){
    var str = ``
    $(data.list).each(function(i,v){
        var Nature = {
            init:v.yes,
            transitions:[
                {
                    name:'select',
                    from:'0',
                    to:'1'
                },{
                    name:'unselected',
                    from:'1',
                    to:'0'
                }
            ],
            methods:{
                onSelect:function(self,index){
                    setSelectRenderDom.call(this,index)
                },
                onUnselected:function(self,index){
                    setSelectRenderDom.call(this,index)
                }
            }
        }
        if (v.yes==1){
            str += `<li><span class="yes select">已选</span> <span>${v.name}</span><button class="remove">删除</button></li>`
            fsm.push(new StateMachine(Nature))
        }else{
            str += `<li><span class="no select">未选</span><span>${v.name}</span><button class="remove">删除</button></li>`
            fsm.push(new StateMachine(Nature))
        }
    })
    $('ul').html(str)
    $('ul').on('click','li',function(){
        var index = Number($(this).index());
        var fsmSingle = fsm[index];
        // 如果为1，则是进行取消选中操作
        if (fsmSingle.is('1')){
            fsmSingle.unselected(index);
        }else{
            // 选中操作
            fsmSingle.select(index);
        }
    })
    
    $('ul').on('click','.remove',function(e){
        e.stopPropagation();
        var $li = $(this).parent()
        var index = $li.index();
        fsm.splice(index, 1);
        $li.remove();
    })
    allSelect();
    addItems();
})

function setSelectRenderDom(index){
    var $ChoiceItem = $('ul').children('li').eq(index)
    // 状态机改变状态后的参数
    if (this.state==0){
        $ChoiceItem.find('.select').text('未选').removeClass('yes').addClass('no')
    }else {
        $ChoiceItem.find('.select').text('已选').removeClass('no').addClass('yes')
    }
}

function allSelect(){
    // 用来储存全选前的数据，便于取消全选后的状态恢复操作
    var isYesArray = []
    var Nature = {
        init:'0',
        transitions:[
            {
                name:'allselect',
                from:'0',
                to:'1'
            },{
                name:'unallselected',
                from:'1',
                to:'0'
            }
        ],
        methods:{
            onAllselect:function(self,index){
                fsm.forEach(function(v,i){
                    if (v.is('0')){
                        v.select(i);
                    }else{
                        isYesArray.push(i)
                    }
                })
            },
            onUnallselected:function(self,index){
                fsm.forEach(function(v,i){
                    if (isYesArray.length>0){
                        // fn
                        for (var ind=0;ind<isYesArray.length;ind++){
                            var val = isYesArray[ind]
                            if(i==val){
                                continue;
                            }else{
                                if (v.is('1')){
                                    v.unselected(i);
                                };
                                continue;
                            }
                        }
                        // isYesArray.forEach(function(val,ind){

                        // })
                    }else{
                        if (v.is('1')){
                            v.unselected(i);
                        }
                    }
                })
                isYesArray = []
                console.log(isYesArray)
            }
        }
    }
    var AllSelectFsm = new StateMachine(Nature);
    $('#allSelect').click(function(){
        if (AllSelectFsm.is('0')){
            AllSelectFsm.allselect()

        }else{
            AllSelectFsm.unallselected()
        }
    })
}

function addItems(){
    var Nature = {
        init:'0',
        transitions:[
            {
                name:'select',
                from:'0',
                to:'1'
            },{
                name:'unselected',
                from:'1',
                to:'0'
            }
        ],
        methods:{
            onSelect:function(self,index){
                setSelectRenderDom.call(this,index)
            },
            onUnselected:function(self,index){
                setSelectRenderDom.call(this,index)
            }
        }
    }
    var str = `<li><span class="no select">未选</span><span>阿三打撒阿斯顿我去额他啊是大</span><button class="remove">删除</button></li>`
    $('#add').click(function(){
        $('ul').append(str)
        fsm.push(new StateMachine(Nature))
    })
}