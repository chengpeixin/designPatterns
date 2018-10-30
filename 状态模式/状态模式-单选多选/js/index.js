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
            str += `<li><span class="yes select">已选</span> <span>${v.name}</span></li>`
            fsm.push(new StateMachine(Nature))
        }else{
            str += `<li><span class="no select">未选</span><span>${v.name}</span></li>`
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
    $('#allSelect').click(function(){
        fsm.forEach(function(v,i){
            if (v.is('0')){
                v.select(i);
            }
        })
    })
    $('#cancelSelect').click(function(){
        fsm.forEach(function(v,i){
            if (v.is('1')){
                v.unselected(i);
            }
        })
    })
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