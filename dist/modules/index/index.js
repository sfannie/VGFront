define("modules/common/indexCommon",["zepto","C"],function(n,e){return n.extend(e.Constant,{title:"Annie"}),e}),define("modules/index/components/vNews",["zepto","vue"],function(n,e){return{data:function(){return{}},created:function(){console.log("子组件")}}}),define("modules/index/index",["vue","modules/common/indexCommon","modules/index/components/vNews"],function(n,e,o){new n({el:"#app",data:function(){return{title:e.Constant.title}},created:function(){e.baseDialog.tips("Hello Dialog!"),console.log(e.Constant.ENV)},methods:{}})});