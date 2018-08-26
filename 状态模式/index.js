$(function(){
	// 向服务器获取是否收藏
	var CollectionState = String(getCollectionState());
	// 
	var fsm = new StateMachine({
		init :CollectionState,
		transitions: [
			{
				name:'doStore',
				from:'0',
				to:'1'
			},
			{
				name:'deleteStore',
				from:'1',
				to:'0'
			}
		],
		methods:{
			onDoStore:function(){
				// loading
				$('#btn').text('收藏中...')
				// 请求
				setTimeout($.proxy(function(){
					var res = MockJson.call(this)
					if (res.state==1){
						console.log('收藏成功!')
						$('#btn').text('取消收藏')
					}
				},this),2000)
			},
			onDeleteStore:function(){
				// loading
				$('#btn').text('取消收藏中...')
				// 模拟请求
				setTimeout($.proxy(function(){
					var res = MockJson.call(this)
					if (res.state==0){
						console.log('取消收藏!')
						$('#btn').text('收藏')
					}
				},this),2000)
			}
		}
	})
//	updateText();
	$('#btn').click(function(){
		if (fsm.is('1')){
			fsm.deleteStore();
		}else {
			fsm.doStore()
		}
	})
	function updateText(){
		if(fsm.state==1){
			$('#btn').text('取消收藏')			
		}else{
			$('#btn').text('收藏')
		}
	}
})


function getCollectionState(){
	return Math.random()>0.5? 1:0
}
// 模拟接口返回数据
function MockJson(){
	if (Number(this.state)===1){
		return {state:1};
	}else {
		return {state:0};
	}
}
